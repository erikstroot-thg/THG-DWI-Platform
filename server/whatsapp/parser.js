import JSZip from 'jszip'

// Parse WhatsApp chat export ZIP
// Returns: { berichten: [], afbeeldingen: [{ filename, base64, mimeType }] }
export async function parseWhatsAppZip(zipBuffer) {
  const zip = await JSZip.loadAsync(zipBuffer)

  let chatText = ''
  const afbeeldingen = []

  for (const [filename, file] of Object.entries(zip.files)) {
    if (file.dir) continue

    // Find the chat text file
    if (filename.endsWith('.txt') && (filename.includes('chat') || filename.includes('_chat') || filename === '_chat.txt')) {
      chatText = await file.async('string')
    }
    // Collect images
    else if (/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
      const base64 = await file.async('base64')
      const ext = filename.split('.').pop().toLowerCase()
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
      afbeeldingen.push({ filename, base64, mimeType })
    }
  }

  // If no chat file found, try the first .txt file
  if (!chatText) {
    for (const [filename, file] of Object.entries(zip.files)) {
      if (!file.dir && filename.endsWith('.txt')) {
        chatText = await file.async('string')
        break
      }
    }
  }

  const berichten = parseChatText(chatText)

  return { berichten, afbeeldingen }
}

// Parse WhatsApp chat text format
// Supports both formats:
// [DD-MM-YYYY, HH:MM:SS] Sender: Message
// DD/MM/YYYY, HH:MM - Sender: Message
function parseChatText(text) {
  if (!text) return []

  const berichten = []
  const lines = text.split('\n')

  // Pattern 1: [DD-MM-YYYY, HH:MM:SS] Sender: Message
  const pattern1 = /^\[(\d{2}-\d{2}-\d{4}),?\s*(\d{2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.+)/
  // Pattern 2: DD/MM/YYYY, HH:MM - Sender: Message
  const pattern2 = /^(\d{2}\/\d{2}\/\d{4}),?\s*(\d{2}:\d{2})\s*-\s*([^:]+):\s*(.+)/

  let currentMessage = null

  for (const line of lines) {
    let match = line.match(pattern1) || line.match(pattern2)

    if (match) {
      // Save previous message
      if (currentMessage) berichten.push(currentMessage)

      const [, datum, tijd, afzender, tekst] = match
      const isMedia = tekst.includes('<Media weggelaten>') ||
                      tekst.includes('<media omitted>') ||
                      tekst.includes('<bijgevoegd:') ||
                      tekst.includes('<attached:')

      currentMessage = {
        datum,
        tijd,
        afzender: afzender.trim(),
        tekst: isMedia ? null : tekst.trim(),
        isMedia,
      }
    } else if (currentMessage && line.trim()) {
      // Continuation of previous message
      if (currentMessage.tekst) {
        currentMessage.tekst += '\n' + line.trim()
      }
    }
  }

  // Don't forget the last message
  if (currentMessage) berichten.push(currentMessage)

  // Filter out system messages (no sender or system notifications)
  return berichten.filter(b =>
    b.afzender &&
    !b.tekst?.includes('end-to-end') &&
    !b.tekst?.includes('groep gemaakt') &&
    !b.tekst?.includes('group created')
  )
}
