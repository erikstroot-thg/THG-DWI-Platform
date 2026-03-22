// API client for DWI generation and persistence

export async function generateDwi({ photos, station, stationNummer, machine, beschrijving, auteur }) {
  const res = await fetch('/api/generate-dwi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos, station, stationNummer, machine, beschrijving, auteur }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }))
    throw new Error(err.error || `Server error: ${res.status}`)
  }

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

export async function checkHealth() {
  try {
    const res = await fetch('/api/health')
    return res.json()
  } catch {
    return { status: 'offline', apiKeyConfigured: false }
  }
}
