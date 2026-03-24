// API client for DWI generation, persistence, and editing

export async function generateDwi({ photos, documents, station, stationNummer, machine, beschrijving, auteur, model }) {
  const res = await fetch('/api/generate-dwi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos, documents, station, stationNummer, machine, beschrijving, auteur, model }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

// Streaming DWI generation with Server-Sent Events
export async function generateDwiStream({ photos, documents, station, stationNummer, machine, beschrijving, auteur, model }, onProgress) {
  const res = await fetch('/api/generate-dwi-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos, documents, station, stationNummer, machine, beschrijving, auteur, model }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let result = null

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Parse SSE events from buffer
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const event = JSON.parse(line.slice(6))

          if (event.type === 'progress' && onProgress) {
            onProgress(event)
          } else if (event.type === 'complete') {
            result = { dwi: event.dwi, usage: event.usage, model: event.model }
          } else if (event.type === 'error') {
            throw new Error(event.error)
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) throw e
        }
      }
    }
  }

  if (!result) {
    throw new Error('Geen resultaat ontvangen van server.')
  }

  return result
}

// AI-assisted step improvement
export async function improveStep(stap, dwiContext, instructie, model) {
  const res = await fetch('/api/dwi/improve-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stap, dwiContext, instructie, model }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

// Enrich existing DWI with WhatsApp data or additional context
export async function enrichDwi(id, dwi, { berichten, afbeeldingen, extraContext, model } = {}) {
  const res = await fetch(`/api/dwi/${encodeURIComponent(id)}/enrich`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dwi, berichten, afbeeldingen, extraContext, model }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

// Parse a WhatsApp ZIP export
export async function parseWhatsAppZip(zipBase64) {
  const res = await fetch('/api/whatsapp/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zipBase64 }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

// Get available models
export async function getModels() {
  const res = await fetch('/api/models')
  if (!res.ok) return { models: [], default: 'sonnet' }
  return res.json()
}

export async function saveDwi(dwi, photos) {
  const res = await fetch('/api/dwi/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dwi, photos }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

export async function getGeneratedDwis() {
  const res = await fetch('/api/dwi/generated')

  if (!res.ok) {
    return []
  }

  const data = await res.json()
  return data.dwis || []
}

export async function getDwi(id) {
  const res = await fetch(`/api/dwi/${encodeURIComponent(id)}`)

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return data.dwi || null
}

export async function updateDwi(id, dwi, { photos, opmerking } = {}) {
  const res = await fetch(`/api/dwi/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dwi, photos, opmerking }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

export async function copyToGenerated(dwi) {
  const res = await fetch(`/api/dwi/${encodeURIComponent(dwi.id)}/copy-to-generated`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dwi }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

export async function getDwiHistory(id) {
  const res = await fetch(`/api/dwi/${encodeURIComponent(id)}/history`)

  if (!res.ok) {
    return []
  }

  const data = await res.json()
  return data.versies || []
}

export async function getContext() {
  const res = await fetch('/api/context')
  if (!res.ok) return { stations: {} }
  return res.json()
}

export async function updateContext(stations) {
  const res = await fetch('/api/context', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stations }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

  return res.json()
}

export async function checkHealth() {
  try {
    const res = await fetch('/api/health')
    return res.json()
  } catch {
    return { status: 'offline', apiKeyConfigured: false }
  }
}
