// API client for DWI generation, persistence, and editing

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

export async function checkHealth() {
  try {
    const res = await fetch('/api/health')
    return res.json()
  } catch {
    return { status: 'offline', apiKeyConfigured: false }
  }
}
