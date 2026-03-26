import { useRef, useState } from 'react'
import { Camera, X, Upload, ImagePlus } from 'lucide-react'

const MAX_PHOTOS = 30
const MAX_SIZE_MB = 5
const MAX_WIDTH = 1920

function resizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Always draw through canvas to guarantee JPEG output
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

export default function FotoUpload({ photos, setPhotos }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    const remaining = MAX_PHOTOS - photos.length
    const toProcess = files.slice(0, remaining)

    const newPhotos = []
    for (const file of toProcess) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        continue // skip too-large files
      }
      const base64 = await resizeImage(file)
      newPhotos.push({
        base64,
        mimeType: 'image/jpeg',
        name: file.name,
      })
    }
    setPhotos(prev => [...prev, ...newPhotos])
  }

  function removePhoto(index) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

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
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-base font-medium text-gray-600">
          Sleep foto's hierheen of klik om te uploaden
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Max {MAX_PHOTOS} foto's, max {MAX_SIZE_MB}MB per foto
        </p>
      </div>

      {/* Camera button for mobile */}
      <div className="flex gap-3">
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

      {/* Thumbnail grid */}
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
    </div>
  )
}
