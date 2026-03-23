import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { getDwiSystemPrompt } from './prompts/dwi-generator.js'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const GENERATED_DIR = join(ROOT, 'src', 'data', 'generated')
const IMAGES_DIR = join(ROOT, 'public', 'images', 'dwi')

// Ensure directories exist
mkdirSync(GENERATED_DIR, { recursive: true })

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
      system: getDwiSystemPrompt(),
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
    const imageDir = join(IMAGES_DIR, dwi.id)
    mkdirSync(imageDir, { recursive: true })

    if (photos && photos.length > 0) {
      photos.forEach((photo, i) => {
        const filename = `stap-${String(i + 1).padStart(2, '0')}.jpg`
        const base64Data = photo.base64.replace(/^data:image\/\w+;base64,/, '')
        writeFileSync(join(imageDir, filename), Buffer.from(base64Data, 'base64'))
      })
    }

    // Save DWI JSON
    const jsonPath = join(GENERATED_DIR, `${dwi.id}.json`)
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

    const validStatuses = ['concept', 'goedgekeurd']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Ongeldige status. Kies uit: ${validStatuses.join(', ')}` })
    }

    // Pin verification for approval
    if (status === 'goedgekeurd') {
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
    dwi.goedgekeurdOp = status === 'goedgekeurd' ? new Date().toISOString() : undefined
    writeFileSync(jsonPath, JSON.stringify(dwi, null, 2), 'utf-8')

    res.json({ success: true, id, status })
  } catch (err) {
    console.error('Status update error:', err)
    res.status(500).json({ error: err.message || 'Status bijwerken mislukt.' })
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
