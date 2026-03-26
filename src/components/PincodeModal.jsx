import { useState, useRef, useEffect } from 'react'
import { X, ShieldCheck } from 'lucide-react'

export default function PincodeModal({ open, onClose, onSubmit, laden = false }) {
  const [pin, setPin] = useState('')
  const [fout, setFout] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setPin('')
      setFout('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (pin.length < 4) {
      setFout('Voer een 4-cijferige pincode in.')
      return
    }
    setFout('')
    try {
      await onSubmit(pin)
    } catch (err) {
      setFout(err.message || 'Ongeldige pincode.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <ShieldCheck className="w-12 h-12 text-thg-green mx-auto mb-3" />
          <h3 className="text-lg font-bold text-thg-blue-dark">DWI Goedkeuren</h3>
          <p className="text-sm text-thg-gray mt-1">Voer de pincode in om goed te keuren</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            className="w-full text-center text-3xl tracking-[0.5em] py-3 border-2 border-gray-200 rounded-xl
              focus:border-thg-blue focus:outline-none font-mono"
          />

          {fout && (
            <p className="text-red-500 text-sm text-center font-medium">{fout}</p>
          )}

          <button
            type="submit"
            disabled={laden || pin.length < 4}
            className="w-full bg-thg-green text-white py-3 rounded-xl font-bold text-lg
              hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {laden ? 'Bezig...' : 'Goedkeuren'}
          </button>
        </form>
      </div>
    </div>
  )
}
