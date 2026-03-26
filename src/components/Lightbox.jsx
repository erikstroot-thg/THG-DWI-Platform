import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ images, captions, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, goNext, goPrev])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white
          bg-black/40 hover:bg-black/60 rounded-full p-2 min-h-[44px] min-w-[44px]
          flex items-center justify-center transition-colors"
        aria-label="Sluiten"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-2 md:left-4 z-50 text-white/80 hover:text-white
            bg-black/40 hover:bg-black/60 rounded-full p-2 min-h-[44px] min-w-[44px]
            flex items-center justify-center transition-colors"
          aria-label="Vorige foto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-[95vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={captions?.[currentIndex] || `Foto ${currentIndex + 1}`}
          className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
          draggable={false}
        />
        {captions?.[currentIndex] && (
          <p className="text-white/90 text-sm md:text-base mt-3 text-center px-4 max-w-2xl">
            {captions[currentIndex]}
          </p>
        )}
        {images.length > 1 && (
          <p className="text-white/50 text-xs mt-2">
            {currentIndex + 1} / {images.length}
          </p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-2 md:right-4 z-50 text-white/80 hover:text-white
            bg-black/40 hover:bg-black/60 rounded-full p-2 min-h-[44px] min-w-[44px]
            flex items-center justify-center transition-colors"
          aria-label="Volgende foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
