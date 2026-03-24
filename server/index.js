import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, cpSync, unlinkSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { getDwiSystemPrompt, getDwiEnrichPrompt } from './prompts/dwi-generator.js'
import { generateDwiHtml } from './pdf-generator.js'
import { THG_KNOWLEDGE_BASE } from './context/thg-knowledge-base.js'
import { parseWhatsAppZip } from './whatsapp/parser.js'

dotenv.config()

// Sanitize filenames for OneDrive/SharePoint compatibility
// Removes: \ / : * ? " < > | and leading/trailing spaces/dots
function sanitizeFilename(name) {
  return name
    .replace(/[\\/:*?"<>|]/g, '_')  // Replace OneDrive-forbidden chars
    .replace(/\.+$/, '')             // No trailing dots
    .replace(/^\s+|\s+$/g, '')       // No leading/trailing spaces
    .replace(/\s{2,}/g, ' ')         // Collapse multiple spaces
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const GENERATED_DIR = join(ROOT, 'src', 'data', 'generated')
const HISTORY_DIR = join(ROOT, 'src', 'data', 'generated', 'history')
const IMAGES_DIR = join(ROOT, 'public', 'images', 'dwi')

// Ensure directories exist
mkdirSync(GENERATED_DIR, { recursive: true })
mkdirSync(HISTORY_DIR, { recursive: true })

const app = express()
app.use(express.json({ limit: '100mb' }))

// Simple rate limiting
const rateLimiter = new Map()
function rateLimit(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const windowMs = 60_000
  const maxRequests = 10

  const requests = rateLimiter.get(ip) || []
  const recent = requests.filter(t => now - t < windowMs)

  if (recent.length >= maxRequests) {
    return res.status(429).json({ error: 'Te veel verzoeken. Wacht even.' })
  }

  recent.push(now)
  rateLimiter.set(ip, recent)
  next()
}

// Initialize Anthropic client
function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY niet gevonden in .env')
  }
  return new Anthropic({ apiKey })
}

// ==========================================================================
// Model configuration
// ==========================================================================
const MODELS = {
  sonnet: 'claude-sonnet-4-20250514',
  opus: 'claude-opus-4-20250514',
}
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'sonnet'
const THINKING_BUDGET = parseInt(process.env.THINKING_BUDGET || '5000', 10)

// Build user content blocks from photos + documents + text
async function buildUserContent({ photos, documents, nextId, station, stationNummer, machine, auteur, beschrijving }) {
  const contentBlocks = []

  // Add photos as image blocks
  if (photos?.length > 0) {
    photos.forEach((photo) => {
      contentBlocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: photo.mimeType || 'image/jpeg',
          data: photo.base64.replace(/^data:image\/\w+;base64,/, ''),
        },
      })
    })
  }

  // Add documents as text context
  if (documents?.length > 0) {
    for (const doc of documents) {
      if (doc.type === 'pdf' && doc.text) {
        contentBlocks.push({
          type: 'text',
          text: `[BIJLAGE: ${doc.filename}]\n${doc.text}\n[/BIJLAGE]`,
        })
      } else if (doc.type === 'pdf' && doc.base64) {
        // Server-side PDF text extraction
        try {
          const pdfParse = (await import('pdf-parse')).default
          const pdfBuffer = Buffer.from(doc.base64.replace(/^data:application\/pdf;base64,/, ''), 'base64')
          const pdfData = await pdfParse(pdfBuffer)
          if (pdfData.text?.trim()) {
            contentBlocks.push({
              type: 'text',
              text: `[BIJLAGE: ${doc.filename} (${pdfData.numpages} pagina's)]\n${pdfData.text.slice(0, 50000)}\n[/BIJLAGE]`,
            })
          }
        } catch (pdfErr) {
          console.warn('PDF parse failed:', doc.filename, pdfErr.message)
          contentBlocks.push({
            type: 'text',
            text: `[BIJLAGE: ${doc.filename}] (PDF kon niet gelezen worden)\n[/BIJLAGE]`,
          })
        }
      } else if (doc.type === 'text' && doc.content) {
        contentBlocks.push({
          type: 'text',
          text: `[BIJLAGE: ${doc.filename}]\n${doc.content}\n[/BIJLAGE]`,
        })
      }
    }
  }

  // Main instruction text
  const photoCount = photos?.length || 0
  const docCount = documents?.length || 0
  let contextParts = []
  if (photoCount > 0) contextParts.push(`${photoCount} foto's`)
  if (docCount > 0) contextParts.push(`${docCount} document(en)`)

  contentBlocks.push({
    type: 'text',
    text: `Genereer een werkinstructie (DWI) op basis van bovenstaande ${contextParts.join(' en ')}.

Gegevens:
- DWI ID: ${nextId}
- Station: ${station} (nummer ${stationNummer})
- Machine: ${machine}
- Auteur: ${auteur || 'Onbekend'}
- Beschrijving/context van de operator: ${beschrijving}

${photoCount > 0 ? `De foto's zijn genummerd van 1 t/m ${photoCount} in de volgorde hierboven.\nGebruik pad: /images/dwi/${nextId}/stap-{NN}.jpg voor de afbeeldingen (01, 02, etc.).` : 'Er zijn geen foto\'s beschikbaar. Genereer SVG-illustraties bij elke stap.'}

Genereer de complete DWI als JSON object. Volg exact het schema uit de system prompt.
Genereer SVG-illustraties bij stappen waar een visueel schema helpt.
Genereer een procesdiagram als het proces een duidelijke flow heeft.`
  })

  return contentBlocks
}

// Extract DWI JSON from Claude response (handles both thinking and non-thinking)
function extractDwiFromResponse(response) {
  // Find text blocks (skip thinking blocks)
  for (const block of response.content) {
    if (block.type === 'text') {
      const jsonMatch = block.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }
  }
  return null
}

// ==========================================================================
// POST /api/generate-dwi
// Accepts photos + documents + context, calls Claude with extended thinking
// ==========================================================================
app.post('/api/generate-dwi', rateLimit, async (req, res) => {
  try {
    const { photos, documents, station, stationNummer, machine, beschrijving, auteur, model: requestedModel } = req.body

    // Validate
    if (!station || !machine || !beschrijving) {
      return res.status(400).json({ error: 'Station, machine en beschrijving zijn verplicht.' })
    }
    if ((!photos || photos.length === 0) && (!documents || documents.length === 0)) {
      return res.status(400).json({ error: 'Upload minimaal 1 foto of document.' })
    }
    if (photos && photos.length > 30) {
      return res.status(400).json({ error: 'Maximaal 30 foto\'s per keer.' })
    }

    const nextId = getNextDwiId(station)
    const userContent = await buildUserContent({ photos, documents, nextId, station, stationNummer, machine, auteur, beschrijving })

    // Determine model
    const modelKey = requestedModel && MODELS[requestedModel] ? requestedModel : DEFAULT_MODEL
    const modelId = MODELS[modelKey]

    const client = getClient()
    const response = await client.messages.create({
      model: modelId,
      max_tokens: 16000,
      thinking: {
        type: 'enabled',
        budget_tokens: THINKING_BUDGET,
      },
      system: getDwiSystemPrompt(station),
      messages: [{ role: 'user', content: userContent }],
    })

    // Extract JSON from response (skipping thinking blocks)
    const dwi = extractDwiFromResponse(response)
    if (!dwi) {
      return res.status(500).json({ error: 'Claude gaf geen geldig JSON terug.' })
    }

    // Ensure required fields
    dwi.id = nextId
    dwi.status = 'concept'

    res.json({ dwi, usage: response.usage, model: modelKey })
  } catch (err) {
    console.error('Generate error:', err)
    if (err.message?.includes('ANTHROPIC_API_KEY')) {
      return res.status(500).json({ error: 'API key niet geconfigureerd. Voeg ANTHROPIC_API_KEY toe aan .env' })
    }
    res.status(500).json({ error: err.message || 'Er ging iets mis bij het genereren.' })
  }
})

// ==========================================================================
// POST /api/generate-dwi-stream
// Same as above but with Server-Sent Events for real-time progress
// ==========================================================================
app.post('/api/generate-dwi-stream', rateLimit, async (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  function sendEvent(type, data) {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`)
  }

  try {
    const { photos, documents, station, stationNummer, machine, beschrijving, auteur, model: requestedModel } = req.body

    // Validate
    if (!station || !machine || !beschrijving) {
      sendEvent('error', { error: 'Station, machine en beschrijving zijn verplicht.' })
      return res.end()
    }
    if ((!photos || photos.length === 0) && (!documents || documents.length === 0)) {
      sendEvent('error', { error: 'Upload minimaal 1 foto of document.' })
      return res.end()
    }

    const nextId = getNextDwiId(station)
    sendEvent('progress', { fase: 'start', bericht: 'DWI-generatie gestart...', id: nextId })

    const userContent = await buildUserContent({ photos, documents, nextId, station, stationNummer, machine, auteur, beschrijving })

    const modelKey = requestedModel && MODELS[requestedModel] ? requestedModel : DEFAULT_MODEL
    const modelId = MODELS[modelKey]

    sendEvent('progress', { fase: 'thinking', bericht: `Claude (${modelKey}) analyseert foto's en denkt na...` })

    const client = getClient()
    let fullText = ''
    let thinkingText = ''
    let isThinking = true

    const stream = await client.messages.stream({
      model: modelId,
      max_tokens: 16000,
      thinking: {
        type: 'enabled',
        budget_tokens: THINKING_BUDGET,
      },
      system: getDwiSystemPrompt(station),
      messages: [{ role: 'user', content: userContent }],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_start') {
        if (event.content_block?.type === 'thinking') {
          isThinking = true
          sendEvent('progress', { fase: 'thinking', bericht: 'Claude denkt na over de beste instructie...' })
        } else if (event.content_block?.type === 'text') {
          isThinking = false
          sendEvent('progress', { fase: 'generating', bericht: 'Werkinstructie wordt gegenereerd...' })
        }
      } else if (event.type === 'content_block_delta') {
        if (event.delta?.type === 'thinking_delta') {
          thinkingText += event.delta.thinking || ''
          // Send periodic thinking updates
          if (thinkingText.length % 200 < 10) {
            sendEvent('progress', { fase: 'thinking', bericht: 'Claude analyseert details...' })
          }
        } else if (event.delta?.type === 'text_delta') {
          fullText += event.delta.text || ''
        }
      }
    }

    // Extract JSON
    const jsonMatch = fullText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      sendEvent('error', { error: 'Claude gaf geen geldig JSON terug.' })
      return res.end()
    }

    const dwi = JSON.parse(jsonMatch[0])
    dwi.id = nextId
    dwi.status = 'concept'

    const finalMessage = await stream.finalMessage()

    sendEvent('complete', { dwi, usage: finalMessage.usage, model: modelKey })
    res.end()
  } catch (err) {
    console.error('Stream generate error:', err)
    sendEvent('error', { error: err.message || 'Er ging iets mis bij het genereren.' })
    res.end()
  }
})

// ==========================================================================
// POST /api/dwi/improve-step
// AI-assisted improvement of a single step
// ==========================================================================
app.post('/api/dwi/improve-step', rateLimit, async (req, res) => {
  try {
    const { stap, dwiContext, instructie, model: requestedModel } = req.body

    if (!stap || !dwiContext) {
      return res.status(400).json({ error: 'Stap en DWI-context zijn verplicht.' })
    }

    const modelKey = requestedModel && MODELS[requestedModel] ? requestedModel : DEFAULT_MODEL
    const modelId = MODELS[modelKey]

    const client = getClient()
    const response = await client.messages.create({
      model: modelId,
      max_tokens: 4000,
      thinking: {
        type: 'enabled',
        budget_tokens: THINKING_BUDGET,
      },
      system: `Je bent een expert in het verbeteren van werkinstructies voor Timmermans Hardglas B.V.
Je taak: verbeter EEN stap van een bestaande DWI op basis van de instructie van de gebruiker.

Regels:
- Alle tekst in het NEDERLANDS
- Behoud het JSON-schema van de stap
- Retourneer ALLEEN het verbeterde stap-object als JSON
- Genereer een SVG-illustratie als dat de stap verduidelijkt
- Schrijf kort, duidelijk, werkvloertaal`,
      messages: [{
        role: 'user',
        content: `DWI-context: ${dwiContext.titel} (${dwiContext.station} - ${dwiContext.machine})

Huidige stap:
${JSON.stringify(stap, null, 2)}

${instructie ? `Instructie voor verbetering: ${instructie}` : 'Verbeter deze stap: maak de beschrijving duidelijker, voeg substappen toe als nodig, en genereer een SVG-illustratie als dat helpt.'}

Retourneer de verbeterde stap als JSON object.`
      }],
    })

    const improved = extractDwiFromResponse(response)
    if (!improved) {
      return res.status(500).json({ error: 'Geen geldig resultaat.' })
    }

    res.json({ stap: improved, usage: response.usage })
  } catch (err) {
    console.error('Improve step error:', err)
    res.status(500).json({ error: err.message || 'Verbetering mislukt.' })
  }
})

// ==========================================================================
// POST /api/dwi/:id/enrich
// Enrich existing DWI with WhatsApp export or additional context
// ==========================================================================
app.post('/api/dwi/:id/enrich', rateLimit, async (req, res) => {
  try {
    const { id } = req.params
    const { dwi, berichten, afbeeldingen, extraContext, model: requestedModel } = req.body

    if (!dwi) {
      return res.status(400).json({ error: 'DWI object is verplicht.' })
    }

    const modelKey = requestedModel && MODELS[requestedModel] ? requestedModel : DEFAULT_MODEL
    const modelId = MODELS[modelKey]

    // Build content for Claude
    const userContent = []

    // Add new images
    if (afbeeldingen?.length > 0) {
      afbeeldingen.forEach(img => {
        userContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: img.mimeType || 'image/jpeg',
            data: img.base64.replace(/^data:image\/\w+;base64,/, ''),
          },
        })
      })
    }

    // Build text context
    let contextText = `Verrijk de volgende bestaande DWI met aanvullende informatie.\n\n`
    contextText += `BESTAANDE DWI:\n${JSON.stringify(dwi, null, 2)}\n\n`

    if (berichten?.length > 0) {
      contextText += `WHATSAPP BERICHTEN VAN OPERATORS:\n`
      berichten.forEach(b => {
        if (b.tekst) {
          contextText += `[${b.datum} ${b.tijd}] ${b.afzender}: ${b.tekst}\n`
        } else if (b.isMedia) {
          contextText += `[${b.datum} ${b.tijd}] ${b.afzender}: [foto/media]\n`
        }
      })
      contextText += `\n`
    }

    if (extraContext) {
      contextText += `EXTRA CONTEXT: ${extraContext}\n\n`
    }

    if (afbeeldingen?.length > 0) {
      contextText += `Er zijn ${afbeeldingen.length} nieuwe foto's bijgevoegd (hierboven). Verwerk deze in de instructie.\n`
    }

    contextText += `\nRetourneer de VOLLEDIGE bijgewerkte DWI als JSON.`

    userContent.push({ type: 'text', text: contextText })

    const client = getClient()
    const response = await client.messages.create({
      model: modelId,
      max_tokens: 16000,
      thinking: {
        type: 'enabled',
        budget_tokens: THINKING_BUDGET,
      },
      system: getDwiEnrichPrompt(dwi.station),
      messages: [{ role: 'user', content: userContent }],
    })

    const enriched = extractDwiFromResponse(response)
    if (!enriched) {
      return res.status(500).json({ error: 'Claude gaf geen geldig JSON terug.' })
    }

    // Preserve immutable fields
    enriched.id = dwi.id
    enriched.station = dwi.station
    enriched.stationNummer = dwi.stationNummer
    enriched.status = dwi.status

    res.json({ dwi: enriched, usage: response.usage })
  } catch (err) {
    console.error('Enrich error:', err)
    res.status(500).json({ error: err.message || 'Verrijking mislukt.' })
  }
})

// ==========================================================================
// POST /api/whatsapp/parse
// Parse a WhatsApp export ZIP and return structured data
// ==========================================================================
app.post('/api/whatsapp/parse', rateLimit, async (req, res) => {
  try {
    const { zipBase64 } = req.body
    if (!zipBase64) {
      return res.status(400).json({ error: 'ZIP-bestand is verplicht.' })
    }

    const buffer = Buffer.from(zipBase64.replace(/^data:[^;]+;base64,/, ''), 'base64')
    const result = await parseWhatsAppZip(buffer)

    res.json({
      berichten: result.berichten,
      afbeeldingenCount: result.afbeeldingen.length,
      afbeeldingen: result.afbeeldingen.map(a => ({
        filename: a.filename,
        mimeType: a.mimeType,
        // Only send first 100 chars of base64 as preview indicator
        hasData: true,
      })),
      // Store full images in memory for the enrich call
      _afbeeldingen: result.afbeeldingen,
    })
  } catch (err) {
    console.error('WhatsApp parse error:', err)
    res.status(500).json({ error: err.message || 'ZIP verwerking mislukt.' })
  }
})

// ==========================================================================
// GET /api/models
// Returns available models
// ==========================================================================
app.get('/api/models', (req, res) => {
  res.json({
    models: Object.keys(MODELS).map(key => ({
      key,
      id: MODELS[key],
      label: key === 'sonnet' ? 'Sonnet 4 (snel, goedkoper)' : 'Opus 4 (best, duurder)',
    })),
    default: DEFAULT_MODEL,
  })
})

// ==========================================================================
// POST /api/dwi/save
// Saves generated DWI JSON + photos to disk
// ==========================================================================
app.post('/api/dwi/save', rateLimit, async (req, res) => {
  try {
    const { dwi, photos } = req.body

    if (!dwi || !dwi.id) {
      return res.status(400).json({ error: 'Ongeldig DWI object.' })
    }

    // Save photos to public/images/dwi/{id}/
    const safeId = sanitizeFilename(dwi.id)
    const imageDir = join(IMAGES_DIR, safeId)
    mkdirSync(imageDir, { recursive: true })

    if (photos && photos.length > 0) {
      photos.forEach((photo, i) => {
        const filename = `stap-${String(i + 1).padStart(2, '0')}.jpg`
        const base64Data = photo.base64.replace(/^data:image\/\w+;base64,/, '')
        writeFileSync(join(imageDir, filename), Buffer.from(base64Data, 'base64'))
      })
    }

    // Save DWI JSON
    const jsonPath = join(GENERATED_DIR, `${safeId}.json`)
    writeFileSync(jsonPath, JSON.stringify(dwi, null, 2), 'utf-8')

    res.json({ success: true, id: dwi.id, path: jsonPath })
  } catch (err) {
    console.error('Save error:', err)
    res.status(500).json({ error: err.message || 'Opslaan mislukt.' })
  }
})

// ==========================================================================
// GET /api/dwi/generated
// Returns all generated DWIs
// ==========================================================================
app.get('/api/dwi/generated', (req, res) => {
  try {
    if (!existsSync(GENERATED_DIR)) {
      return res.json({ dwis: [] })
    }

    const files = readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'))
    const dwis = files.map(f => {
      const content = readFileSync(join(GENERATED_DIR, f), 'utf-8')
      return JSON.parse(content)
    })

    res.json({ dwis })
  } catch (err) {
    console.error('List error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// GET /api/dwi/:id
// Returns a single DWI by ID (from generated or hardcoded)
// ==========================================================================
app.get('/api/dwi/:id', (req, res) => {
  try {
    const { id } = req.params
    const jsonPath = join(GENERATED_DIR, `${id}.json`)

    if (existsSync(jsonPath)) {
      const content = readFileSync(jsonPath, 'utf-8')
      return res.json({ dwi: JSON.parse(content) })
    }

    res.status(404).json({ error: `DWI ${id} niet gevonden.` })
  } catch (err) {
    console.error('Get DWI error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// PATCH /api/dwi/:id/status
// Update DWI status (requires pin for 'goedgekeurd')
// ==========================================================================
app.patch('/api/dwi/:id/status', (req, res) => {
  try {
    const { id } = req.params
    const { status, pin } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status is verplicht.' })
    }

    const validStatuses = ['concept', 'review', 'goedgekeurd', 'gepubliceerd', 'gearchiveerd']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Ongeldige status. Kies uit: ${validStatuses.join(', ')}` })
    }

    // Pin verification for approval and publish
    if (status === 'goedgekeurd' || status === 'gepubliceerd') {
      const correctPin = process.env.DWI_APPROVE_PIN || '7772'
      if (!pin || pin !== correctPin) {
        return res.status(403).json({ error: 'Ongeldige pincode.' })
      }
    }

    // Find and update the DWI file
    const jsonPath = join(GENERATED_DIR, `${id}.json`)
    if (!existsSync(jsonPath)) {
      return res.status(404).json({ error: `DWI ${id} niet gevonden.` })
    }

    const dwi = JSON.parse(readFileSync(jsonPath, 'utf-8'))
    dwi.status = status
    const now = new Date().toISOString()
    if (status === 'goedgekeurd') dwi.goedgekeurdOp = now
    if (status === 'gepubliceerd') dwi.gepubliceerdOp = now
    if (status === 'gearchiveerd') dwi.gearchiveerdOp = now
    writeFileSync(jsonPath, JSON.stringify(dwi, null, 2), 'utf-8')

    res.json({ success: true, id, status })
  } catch (err) {
    console.error('Status update error:', err)
    res.status(500).json({ error: err.message || 'Status bijwerken mislukt.' })
  }
})

// ==========================================================================
// PUT /api/dwi/:id
// Updates an existing DWI with auto-versioning and history tracking
// ==========================================================================
app.put('/api/dwi/:id', rateLimit, async (req, res) => {
  try {
    const { id } = req.params
    const { dwi, photos, opmerking } = req.body

    if (!dwi || dwi.id !== id) {
      return res.status(400).json({ error: 'Ongeldig DWI object of ID mismatch.' })
    }

    const jsonPath = join(GENERATED_DIR, `${id}.json`)

    // Save previous version to history if exists
    if (existsSync(jsonPath)) {
      const previous = JSON.parse(readFileSync(jsonPath, 'utf-8'))
      const historyDir = join(HISTORY_DIR, id)
      mkdirSync(historyDir, { recursive: true })
      const historyPath = join(historyDir, `v${previous.versie || '1.0'}.json`)
      writeFileSync(historyPath, JSON.stringify(previous, null, 2), 'utf-8')
    }

    // Increment version
    const oldVersion = dwi.versie || '1.0'
    const [major, minor] = oldVersion.split('.').map(Number)
    dwi.versie = `${major}.${minor + 1}`

    // Update date
    const now = new Date()
    const datum = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`

    // Add revision entry
    if (!dwi.revisies) dwi.revisies = []
    dwi.revisies.push({
      versie: dwi.versie,
      datum,
      auteur: dwi._bewerkDoor || 'Onbekend',
      opmerking: opmerking || 'Handmatige bewerking'
    })
    delete dwi._bewerkDoor

    // Update volgendeReview to 6 months from now
    const review = new Date(now)
    review.setMonth(review.getMonth() + 6)
    dwi.volgendeReview = `${String(review.getDate()).padStart(2, '0')}-${String(review.getMonth() + 1).padStart(2, '0')}-${review.getFullYear()}`

    // Save new photos if provided
    if (photos && photos.length > 0) {
      const imageDir = join(IMAGES_DIR, id)
      mkdirSync(imageDir, { recursive: true })

      photos.forEach((photo) => {
        if (photo.base64 && photo.filename) {
          const base64Data = photo.base64.replace(/^data:image\/\w+;base64,/, '')
          writeFileSync(join(imageDir, sanitizeFilename(photo.filename)), Buffer.from(base64Data, 'base64'))
        }
      })
    }

    // Save updated DWI JSON
    writeFileSync(jsonPath, JSON.stringify(dwi, null, 2), 'utf-8')

    res.json({ success: true, id, versie: dwi.versie })
  } catch (err) {
    console.error('Update DWI error:', err)
    res.status(500).json({ error: err.message || 'Bijwerken mislukt.' })
  }
})

// ==========================================================================
// POST /api/dwi/:id/copy-to-generated
// Copies a hardcoded DWI to the generated folder so it becomes editable
// ==========================================================================
app.post('/api/dwi/:id/copy-to-generated', rateLimit, (req, res) => {
  try {
    const { id } = req.params
    const { dwi } = req.body

    if (!dwi || dwi.id !== id) {
      return res.status(400).json({ error: 'Ongeldig DWI object.' })
    }

    const jsonPath = join(GENERATED_DIR, `${id}.json`)

    // Don't overwrite if already exists
    if (existsSync(jsonPath)) {
      return res.json({ success: true, id, alreadyExists: true })
    }

    // Add initial revision entry
    if (!dwi.revisies) {
      dwi.revisies = [{
        versie: dwi.versie || '1.0',
        datum: dwi.datum || 'Onbekend',
        auteur: dwi.auteur || 'Systeem',
        opmerking: 'Gekopieerd naar bewerkbare opslag'
      }]
    }

    writeFileSync(jsonPath, JSON.stringify(dwi, null, 2), 'utf-8')
    res.json({ success: true, id })
  } catch (err) {
    console.error('Copy error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// GET /api/dwi/:id/history
// Returns revision history for a DWI
// ==========================================================================
app.get('/api/dwi/:id/history', (req, res) => {
  try {
    const { id } = req.params
    const historyDir = join(HISTORY_DIR, id)

    if (!existsSync(historyDir)) {
      return res.json({ versies: [] })
    }

    const files = readdirSync(historyDir).filter(f => f.endsWith('.json')).sort()
    const versies = files.map(f => {
      const content = readFileSync(join(historyDir, f), 'utf-8')
      const dwi = JSON.parse(content)
      return { versie: dwi.versie, datum: dwi.datum, bestandsnaam: f }
    })

    res.json({ versies })
  } catch (err) {
    console.error('History error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// GET /api/context
// Returns the current knowledge base (stations with machines/processes)
// ==========================================================================
const CONTEXT_FILE = join(ROOT, 'server', 'context', 'thg-knowledge-base.json')

app.get('/api/context', (req, res) => {
  try {
    // Try JSON override first, fall back to JS module
    if (existsSync(CONTEXT_FILE)) {
      const content = readFileSync(CONTEXT_FILE, 'utf-8')
      return res.json(JSON.parse(content))
    }
    // Return stations from the JS module
    res.json({ stations: THG_KNOWLEDGE_BASE.stations })
  } catch (err) {
    console.error('Context error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// PUT /api/context
// Updates station-specific context (machines, processes) via Beheer
// ==========================================================================
app.put('/api/context', rateLimit, (req, res) => {
  try {
    const { stations } = req.body
    if (!stations) {
      return res.status(400).json({ error: 'Stations object verplicht.' })
    }

    // Save as JSON override file
    writeFileSync(CONTEXT_FILE, JSON.stringify({ stations }, null, 2), 'utf-8')
    res.json({ success: true })
  } catch (err) {
    console.error('Context update error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// DELETE /api/dwi/:id
// Delete a DWI and its images
// ==========================================================================
app.delete('/api/dwi/:id', (req, res) => {
  try {
    const { id } = req.params

    // Delete JSON file
    const jsonPath = join(GENERATED_DIR, `${id}.json`)
    if (existsSync(jsonPath)) {
      unlinkSync(jsonPath)
    }

    // Delete image directory
    const imageDir = join(IMAGES_DIR, id)
    if (existsSync(imageDir)) {
      rmSync(imageDir, { recursive: true, force: true })
    }

    res.json({ success: true, id })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ error: err.message || 'Verwijderen mislukt.' })
  }
})

// ==========================================================================
// GET /api/dwi/:id/pdf — Generate printable HTML for PDF export
// ==========================================================================
app.get('/api/dwi/:id/pdf', (req, res) => {
  try {
    const { id } = req.params
    const jsonPath = join(GENERATED_DIR, `${id}.json`)

    let dwi
    if (existsSync(jsonPath)) {
      dwi = JSON.parse(readFileSync(jsonPath, 'utf-8'))
    } else {
      return res.status(404).json({ error: `DWI ${id} niet gevonden.` })
    }

    const html = generateDwiHtml(dwi)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(html)
  } catch (err) {
    console.error('PDF generation error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// Analytics — View tracking
// ==========================================================================
const ANALYTICS_FILE = join(ROOT, 'src', 'data', 'generated', 'analytics.json')

function loadAnalytics() {
  if (existsSync(ANALYTICS_FILE)) {
    return JSON.parse(readFileSync(ANALYTICS_FILE, 'utf-8'))
  }
  return { views: [], dailyStats: {} }
}

function saveAnalytics(data) {
  writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// POST /api/analytics/view — Track a DWI view
app.post('/api/analytics/view', (req, res) => {
  try {
    const { dwiId, station } = req.body
    if (!dwiId) return res.status(400).json({ error: 'dwiId is verplicht.' })

    const analytics = loadAnalytics()
    const now = new Date()
    const dateKey = now.toISOString().split('T')[0] // YYYY-MM-DD

    // Add view event
    analytics.views.push({
      dwiId,
      station: station || null,
      timestamp: now.toISOString(),
      ip: req.ip,
    })

    // Keep only last 10000 views to prevent file bloat
    if (analytics.views.length > 10000) {
      analytics.views = analytics.views.slice(-10000)
    }

    // Update daily stats
    if (!analytics.dailyStats[dateKey]) {
      analytics.dailyStats[dateKey] = {}
    }
    analytics.dailyStats[dateKey][dwiId] = (analytics.dailyStats[dateKey][dwiId] || 0) + 1

    saveAnalytics(analytics)
    res.json({ success: true })
  } catch (err) {
    console.error('Analytics error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/analytics — Get analytics summary
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = loadAnalytics()

    // Calculate totals per DWI
    const totals = {}
    for (const [, dwis] of Object.entries(analytics.dailyStats)) {
      for (const [dwiId, count] of Object.entries(dwis)) {
        totals[dwiId] = (totals[dwiId] || 0) + count
      }
    }

    // Last 30 days daily views
    const now = new Date()
    const last30 = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const dayTotal = analytics.dailyStats[key]
        ? Object.values(analytics.dailyStats[key]).reduce((a, b) => a + b, 0)
        : 0
      last30.push({ datum: key, views: dayTotal })
    }

    // Top 10 most viewed
    const top10 = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, views]) => ({ id, views }))

    // Recent views (last 50)
    const recent = analytics.views.slice(-50).reverse().map(v => ({
      dwiId: v.dwiId,
      timestamp: v.timestamp,
    }))

    res.json({ totals, last30, top10, recent, totalViews: analytics.views.length })
  } catch (err) {
    console.error('Analytics error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// POST /api/dwi/:id/translate — AI translation
// ==========================================================================
app.post('/api/dwi/:id/translate', rateLimit, async (req, res) => {
  try {
    const { id } = req.params
    const { taal } = req.body // 'en' or 'ro'

    if (!taal || !['en', 'ro'].includes(taal)) {
      return res.status(400).json({ error: 'Taal moet "en" (Engels) of "ro" (Roemeens) zijn.' })
    }

    const jsonPath = join(GENERATED_DIR, `${id}.json`)
    if (!existsSync(jsonPath)) {
      return res.status(404).json({ error: `DWI ${id} niet gevonden.` })
    }

    const dwi = JSON.parse(readFileSync(jsonPath, 'utf-8'))
    const taalNamen = { en: 'English', ro: 'Romanian' }

    const response = await client.messages.create({
      model: process.env.DEFAULT_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: `You are a professional translator specializing in manufacturing and industrial documentation. Translate the given DWI (Digital Work Instruction) JSON to ${taalNamen[taal]}.

Rules:
- Translate ALL text fields: titel, beschrijving, waarschuwing, tip, substappen, bijschrift, afwijkingen, zoektermen, pbm, gereedschap, materialen.naam, kpis, opmerkingenImportant
- Do NOT translate: id, station, stationNummer, machine brand names, versie, datum, auteur, goedgekeurd, status, afbeeldingen paths
- Keep the exact same JSON structure
- Use industry-standard terminology for the target language
- Return ONLY the translated JSON object, no other text`,
      messages: [{
        role: 'user',
        content: `Translate this DWI to ${taalNamen[taal]}:\n\n${JSON.stringify(dwi, null, 2)}`
      }]
    })

    const text = response.content.find(b => b.type === 'text')?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Kon vertaling niet parsen.' })
    }

    const translated = JSON.parse(jsonMatch[0])
    translated.id = `${id}-${taal}`
    translated.taal = taal
    translated.bronDwi = id

    // Save translated version
    const transPath = join(GENERATED_DIR, `${id}-${taal}.json`)
    writeFileSync(transPath, JSON.stringify(translated, null, 2), 'utf-8')

    res.json({ success: true, dwi: translated, id: translated.id })
  } catch (err) {
    console.error('Translation error:', err)
    res.status(500).json({ error: err.message || 'Vertaling mislukt.' })
  }
})

// ==========================================================================
// 5S Audit system
// ==========================================================================
const VIJFS_DIR = join(ROOT, 'src', 'data', 'generated', 'vijfs')
mkdirSync(VIJFS_DIR, { recursive: true })

// POST /api/vijfs/:station — Save a 5S audit
app.post('/api/vijfs/:station', (req, res) => {
  try {
    const { station } = req.params
    const audit = req.body

    if (!audit.auditor || !audit.scores) {
      return res.status(400).json({ error: 'Auditor en scores zijn verplicht.' })
    }

    audit.id = `5S-${station}-${Date.now()}`
    audit.station = station

    const stationDir = join(VIJFS_DIR, station)
    mkdirSync(stationDir, { recursive: true })
    writeFileSync(join(stationDir, `${audit.id}.json`), JSON.stringify(audit, null, 2), 'utf-8')

    res.json({ success: true, id: audit.id })
  } catch (err) {
    console.error('5S save error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/vijfs/:station/historie — Get 5S audit history
app.get('/api/vijfs/:station/historie', (req, res) => {
  try {
    const { station } = req.params
    const stationDir = join(VIJFS_DIR, station)

    if (!existsSync(stationDir)) {
      return res.json({ audits: [] })
    }

    const files = readdirSync(stationDir).filter(f => f.endsWith('.json')).sort().reverse()
    const audits = files.slice(0, 50).map(f => JSON.parse(readFileSync(join(stationDir, f), 'utf-8')))
    res.json({ audits })
  } catch (err) {
    console.error('5S history error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/vijfs/overzicht — Latest 5S scores per station
app.get('/api/vijfs/overzicht', (req, res) => {
  try {
    const result = {}
    if (!existsSync(VIJFS_DIR)) return res.json({ stations: result })

    const stationDirs = readdirSync(VIJFS_DIR).filter(d => {
      const p = join(VIJFS_DIR, d)
      return existsSync(p) && readdirSync(p).length > 0
    })

    for (const station of stationDirs) {
      const dir = join(VIJFS_DIR, station)
      const files = readdirSync(dir).filter(f => f.endsWith('.json')).sort().reverse()
      if (files.length > 0) {
        const latest = JSON.parse(readFileSync(join(dir, files[0]), 'utf-8'))
        result[station] = {
          datum: latest.datum,
          auditor: latest.auditor,
          totaalPercentage: latest.totaalScores?._totaal?.percentage || 0,
          aantalAudits: files.length,
        }
      }
    }

    res.json({ stations: result })
  } catch (err) {
    console.error('5S overview error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// IST/SOLL/GAP analysis
// ==========================================================================
const IST_SOLL_DIR = join(ROOT, 'src', 'data', 'generated', 'ist-soll-gap')
mkdirSync(IST_SOLL_DIR, { recursive: true })

// POST /api/ist-soll-gap/:station — Save analysis
app.post('/api/ist-soll-gap/:station', rateLimit, (req, res) => {
  try {
    const { station } = req.params
    const analyse = req.body

    if (!analyse.auteur) {
      return res.status(400).json({ error: 'Auteur is verplicht.' })
    }

    analyse.station = station
    analyse.datum = new Date().toISOString()
    analyse.id = `ISG-${station}-${Date.now()}`

    writeFileSync(join(IST_SOLL_DIR, `${analyse.id}.json`), JSON.stringify(analyse, null, 2), 'utf-8')
    res.json({ success: true, id: analyse.id })
  } catch (err) {
    console.error('IST/SOLL/GAP save error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/ist-soll-gap — List all analyses
app.get('/api/ist-soll-gap', (req, res) => {
  try {
    if (!existsSync(IST_SOLL_DIR)) return res.json({ analyses: [] })
    const files = readdirSync(IST_SOLL_DIR).filter(f => f.endsWith('.json')).sort().reverse()
    const analyses = files.map(f => JSON.parse(readFileSync(join(IST_SOLL_DIR, f), 'utf-8')))
    res.json({ analyses })
  } catch (err) {
    console.error('IST/SOLL/GAP list error:', err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ist-soll-gap/:station/generate — AI-generated analysis
app.post('/api/ist-soll-gap/:station/generate', rateLimit, async (req, res) => {
  try {
    const { station } = req.params
    const { beschrijving, knelpunten } = req.body

    const client = getClient()
    const response = await client.messages.create({
      model: process.env.DEFAULT_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: `Je bent een procesoptimalisatie expert voor Timmermans Hardglas B.V. (THG), een glasfabriek in Hardenberg.

Genereer een IST/SOLL/GAP analyse voor het opgegeven station in JSON-formaat.

JSON schema:
{
  "station": "STATIONCODE",
  "titel": "Korte titel",
  "ist": [
    { "categorie": "Bijv. Proces/Kwaliteit/Veiligheid/Doorlooptijd", "beschrijving": "Hoe het nu werkt", "score": 1-5 }
  ],
  "soll": [
    { "categorie": "Zelfde categorie als IST", "beschrijving": "Hoe het zou moeten werken", "score": 1-5 }
  ],
  "gap": [
    { "categorie": "Zelfde", "verschil": "Wat is het verschil", "impact": "hoog/midden/laag", "actie": "Concrete verbeteractie", "prioriteit": 1-5, "verantwoordelijke": "Functie/rol" }
  ],
  "samenvatting": "Korte samenvatting van de analyse"
}

Retourneer ALLEEN het JSON object.`,
      messages: [{
        role: 'user',
        content: `Genereer een IST/SOLL/GAP analyse voor station ${station} bij THG.

Beschrijving huidige situatie: ${beschrijving || 'Niet opgegeven'}
Bekende knelpunten: ${knelpunten || 'Niet opgegeven'}

Gebruik je kennis van glasfabrieken en productie-optimalisatie.`
      }]
    })

    const text = response.content.find(b => b.type === 'text')?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Kon analyse niet parsen.' })
    }

    const analyse = JSON.parse(jsonMatch[0])
    analyse.station = station
    res.json({ analyse })
  } catch (err) {
    console.error('IST/SOLL/GAP generate error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================================================================
// GET /api/health
// ==========================================================================
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY
  res.json({ status: 'ok', apiKeyConfigured: hasKey })
})

// ==========================================================================
// Helper: Get next DWI ID for a station
// ==========================================================================
function getNextDwiId(station) {
  const existingIds = []

  if (existsSync(GENERATED_DIR)) {
    const files = readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'))
    files.forEach(f => {
      if (f.startsWith(`DWI-${station}-`)) {
        existingIds.push(f.replace('.json', ''))
      }
    })
  }

  if (existsSync(IMAGES_DIR)) {
    const dirs = readdirSync(IMAGES_DIR).filter(d => d.startsWith(`DWI-${station}-`))
    dirs.forEach(d => existingIds.push(d))
  }

  let maxNum = 0
  existingIds.forEach(id => {
    const match = id.match(/DWI-\w+-(\d+)/)
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1], 10))
    }
  })

  return `DWI-${station}-${String(maxNum + 1).padStart(3, '0')}`
}

// ==========================================================================
// Start server
// ==========================================================================
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`THG DWI API server draait op http://localhost:${PORT}`)
  console.log(`API key geconfigureerd: ${!!process.env.ANTHROPIC_API_KEY}`)
})
