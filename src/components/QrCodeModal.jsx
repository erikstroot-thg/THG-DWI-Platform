import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Download, Printer, Copy, CheckCircle } from 'lucide-react'

export default function QrCodeModal({ open, onClose, dwiId, dwiTitel }) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef(null)

  if (!open) return null

  const baseUrl = window.location.origin
  const dwiUrl = `${baseUrl}/dwi/${dwiId}`

  function handleCopyUrl() {
    navigator.clipboard.writeText(dwiUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownloadSvg() {
    const svgEl = qrRef.current?.querySelector('svg')
    if (!svgEl) return

    const svgData = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `QR-${dwiId}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleDownloadPng() {
    const svgEl = qrRef.current?.querySelector('svg')
    if (!svgEl) return

    const canvas = document.createElement('canvas')
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    const svgData = new XMLSerializer().serializeToString(svgEl)
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `QR-${dwiId}.png`
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  function handlePrint() {
    const svgEl = qrRef.current?.querySelector('svg')
    if (!svgEl) return

    const svgData = new XMLSerializer().serializeToString(svgEl)
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>QR Code - ${dwiId}</title>
        <style>
          body { display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 100vh; margin: 0; font-family: Calibri, sans-serif; }
          .label { margin-top: 16px; font-size: 14px; color: #595959; }
          .id { font-size: 20px; font-weight: bold; color: #005A9C; margin-top: 8px; }
          .titel { font-size: 16px; color: #333; margin-top: 4px; }
          .url { font-size: 11px; color: #999; margin-top: 12px; word-break: break-all; max-width: 300px; text-align: center; }
        </style></head>
        <body>
          <div style="text-align: center;">
            ${svgData}
            <div class="label">Scan voor werkinstructie</div>
            <div class="id">${dwiId}</div>
            <div class="titel">${dwiTitel}</div>
            <div class="url">${dwiUrl}</div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <h3 className="text-lg font-bold text-thg-blue-dark">QR-code</h3>
          <p className="text-sm text-thg-gray">{dwiId}</p>

          <div ref={qrRef} className="flex justify-center py-4">
            <QRCodeSVG
              value={dwiUrl}
              size={200}
              level="M"
              fgColor="#005A9C"
              bgColor="#ffffff"
              includeMargin
            />
          </div>

          <p className="text-xs text-gray-400 break-all px-4">{dwiUrl}</p>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleDownloadPng}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-thg-blue text-white
                rounded-lg text-sm font-medium hover:bg-thg-blue-light transition-colors"
            >
              <Download className="w-4 h-4" /> PNG
            </button>
            <button
              onClick={handleDownloadSvg}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-thg-accent text-white
                rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" /> SVG
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 text-gray-700
                rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Printer className="w-4 h-4" /> Printen
            </button>
            <button
              onClick={handleCopyUrl}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 text-gray-700
                rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-thg-green" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Gekopieerd!' : 'Kopieer URL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
