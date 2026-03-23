import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, cpSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { getDwiSystemPrompt, getDwiEnrichPrompt } from './prompts/dwi-generator.js'
import { THG_KNOWLEDGE_BASE } from './context/thg-knowledge-base.js'

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
// POST /api/generate-dwi
// Accepts photos (base64) + context, calls Claude, returns DWI JSON
// ==========================================================================
app.post('/api/generate-dwi', rateLimit, async (req, res) => {
  try {
    const { photos, station, stationNummer, machine, beschrijving, auteur } = req.body

    // Validate
    if (!station || !machine || !beschrijving) {
      return res.status(400).json({ error: 'Station, machine en beschrijving zijn verplicht.' })
    }
    if (!photos || photos.length === 0) {
      return res.status(400).json({ error: 'Upload minimaal 1 foto.' })
    }
    if (photos.length > 30) {
      return res.status(400).json({ error: 'Maximaal 30 foto\'s per keer.' })
    }

    // Determine next ID for this station
    const nextId = getNextDwiId(station)

    // Build Claude messages with vision
    const imageBlocks = photos.map((photo, i) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: photo.mimeType || 'image/jpeg',
        data: photo.base64.replace(/^data:image\/\w+;base64,/, ''),
      },
    }))

    const userContent = [
      ...imageBlocks,
      {
        type: 'text',
        text: `Genereer een werkinstructie (DWI) op basis van bovenstaande ${photos.length} foto's.

Gegevens:
- DWI ID: ${nextId}
- Station: ${station} (nummer ${stationNummer})
- Machine: ${machine}
- Auteur: ${auteur || 'Onbekend'}
- Beschrijving/context van de operator: ${beschrijving}

De foto's zijn genummerd van 1 t/m ${photos.length} in de volgorde hierboven.
Gebruik pad: /images/dwi/${nextId}/stap-{NN}.jpg voor de afbeeldingen (01, 02, etc.).

Genereer de complete DWI als JSON object. Volg exact het schema uit de system prompt.`
      }
    ]

    const client = getClient()
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: getDwiSystemPrompt(station),
      messages: [{ role: 'user', content: userContent }],
    })

    // Extract JSON from response
    const text = response.content[0].text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Claude gaf geen geldig JSON terug.' })
    }

    const dwi = JSON.parse(jsonMatch[0])

    // Ensure required fields
    dwi.id = nextId
    dwi.status = 'concept'

    res.json({ dwi, usage: response.usage })
  } catch (err) {
    console.error('Generate error:', err)
    if (err.message?.includes('ANTHROPIC_API_KEY')) {
      return res.status(500).json({ error: 'API key niet geconfigureerd. Voeg ANTHROPIC_API_KEY toe aan .env' })
    }
    res.status(500).json({ error: err.message || 'Er ging iets mis bij het genereren.' })
  }
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
  // Check existing hardcoded IDs
  const existingIds = []

  // Scan generated directory
  if (existsSync(GENERATED_DIR)) {
    const files = readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'))
    files.forEach(f => {
      if (f.startsWith(`DWI-${station}-`)) {
        existingIds.push(f.replace('.json', ''))
      }
    })
  }

  // Scan image directories for hardcoded ones
  if (existsSync(IMAGES_DIR)) {
    const dirs = readdirSync(IMAGES_DIR).filter(d => d.startsWith(`DWI-${station}-`))
    dirs.forEach(d => existingIds.push(d))
  }

  // Find max number
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
app.listen(PORT, () => {
  console.log(`THG DWI API server draait op http://localhost:${PORT}`)
  console.log(`API key geconfigureerd: ${!!process.env.ANTHROPIC_API_KEY}`)
})
