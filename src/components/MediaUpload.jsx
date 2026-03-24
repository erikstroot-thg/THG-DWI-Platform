import { useRef, useState } from 'react'
import { Camera, X, Upload, ImagePlus, FileText, FileArchive, File } from 'lucide-react'

const MAX_PHOTOS = 30
const MAX_SIZE_MB = 5
const MAX_WIDTH = 1920

// Accepted file types beyond images
const DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]

const ALL_ACCEPT = 'image/*,.pdf,.txt,.zip'

function resizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        if (img.width > MAX_WIDTH) {
          const scale = MAX_WIDTH / img.width
          canvas.width = MAX_WIDTH
          canvas.height = Math.round(img.height * scale)
        } else {
          canvas.width = img.width
          canvas.height = img.height
        }
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function readFileAsBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

function readFileAsText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsText(file)
  })
}

function getFileIcon(type) {
  if (type === 'pdf') return <FileText className="w-6 h-6 text-red-500" />
  if (type === 'zip') return <FileArchive className="w-6 h-6 text-yellow-600" />
  if (type === 'text') return <FileText className="w-6 h-6 text-blue-500" />
  return <File className="w-6 h-6 text-gray-500" />
}

export default function MediaUpload({ photos, setPhotos, documents, setDocuments, photosOnly = false }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleFiles(fileList) {
    const files = Array.from(fileList)

    for (const file of files) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) continue

      if (file.type.startsWith('image/')) {
        // Image file
        if (photos.length >= MAX_PHOTOS) continue
        const base64 = await resizeImage(file)
        setPhotos(prev => [...prev, { base64, mimeType: 'image/jpeg', name: file.name }])
      } else if (!photosOnly && setDocuments) {
        // Document file
        if (file.type === 'application/pdf') {
          const base64 = await readFileAsBase64(file)
          setDocuments(prev => [...prev, { type: 'pdf', filename: file.name, base64, size: file.size }])
        } else if (file.type === 'text/plain') {
          const content = await readFileAsText(file)
          setDocuments(prev => [...prev, { type: 'text', filename: file.name, content, size: file.size }])
        } else if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.endsWith('.zip')) {
          const base64 = await readFileAsBase64(file)
          setDocuments(prev => [...prev, { type: 'zip', filename: file.name, base64, size: file.size }])
        }
      }
    }
  }

  function removePhoto(index) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  function removeDocument(index) {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const acceptTypes = photosOnly ? 'image/*' : ALL_ACCEPT

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${dragOver ? 'border-thg-accent bg-blue-50' : 'border-gray-300 hover:border-thg-accent'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-base font-medium text-gray-600">
          Sleep bestanden hierheen of klik om te uploaden
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {photosOnly
            ? `Max ${MAX_PHOTOS} foto's, max ${MAX_SIZE_MB}MB per foto`
            : `Foto's, PDF's, tekstbestanden, ZIP-bestanden (max ${MAX_SIZE_MB}MB per bestand)`
          }
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.capture = 'environment'
            input.onchange = (e) => handleFiles(e.target.files)
            input.click()
          }}
          className="flex items-center gap-2 bg-thg-blue text-white font-semibold
            py-3 px-5 rounded-lg min-h-[44px] hover:bg-thg-blue-light transition-colors"
        >
          <Camera className="w-5 h-5" />
          Neem foto
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold
            py-3 px-5 rounded-lg min-h-[44px] hover:bg-gray-50 transition-colors"
        >
          <ImagePlus className="w-5 h-5" />
          Bestanden kiezen
        </button>
      </div>

      {/* Photo thumbnail grid */}
      {photos.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {photos.length} / {MAX_PHOTOS} foto's
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={photo.base64}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1
                    opacity-0 group-hover:opacity-100 transition-opacity min-w-[28px] min-h-[28px]
                    flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document list */}
      {documents && documents.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {documents.length} document(en)
          </p>
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                {getFileIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{doc.filename}</p>
                  <p className="text-xs text-gray-400">
                    {doc.type.toUpperCase()} &middot; {(doc.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(i)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
