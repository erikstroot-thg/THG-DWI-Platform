import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Brain,
  Cpu,
  Zap,
} from 'lucide-react'
import { STATIONS } from '../data/werkinstructies'
import MediaUpload from './MediaUpload'
import DwiVoorbeeld from './DwiVoorbeeld'
import { generateDwiStream, saveDwi, getModels } from '../utils/dwiService'

const WORK_STATIONS = STATIONS.filter(s => s.code !== 'alle')

// Streaming progress indicator
function StreamProgress({ progress }) {
  if (!progress) return null

  const faseIcons = {
    start: <Zap className="w-5 h-5" />,
    thinking: <Brain className="w-5 h-5 animate-pulse" />,
    generating: <Cpu className="w-5 h-5 animate-spin" />,
  }

  const faseColors = {
    start: 'bg-blue-50 border-blue-200 text-blue-800',
    thinking: 'bg-purple-50 border-purple-200 text-purple-800',
    generating: 'bg-green-50 border-green-200 text-green-800',
  }

  return (
    <div className={`flex items-center gap-3 rounded-xl p-4 border ${faseColors[progress.fase] || 'bg-gray-50 border-gray-200'}`}>
      {faseIcons[progress.fase] || <Loader2 className="w-5 h-5 animate-spin" />}
      <div>
        <p className="font-semibold">{progress.bericht}</p>
        {progress.id && <p className="text-xs opacity-70 mt-0.5">ID: {progress.id}</p>}
      </div>
    </div>
  )
}

export default function NieuwDwiPagina() {
  const navigate = useNavigate()

  // Form state
  const [station, setStation] = useState('')
  const [machine, setMachine] = useState('')
  const [beschrijving, setBeschrijving] = useState('')
  const [auteur, setAuteur] = useState('')
  const [photos, setPhotos] = useState([])
  const [documents, setDocuments] = useState([])
  const [selectedModel, setSelectedModel] = useState('sonnet')
  const [availableModels, setAvailableModels] = useState([])

  // Generation state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedDwi, setGeneratedDwi] = useState(null)
  const [streamProgress, setStreamProgress] = useState(null)

  // Save state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedStation = WORK_STATIONS.find(s => s.code === station)

  // Load available models
  useEffect(() => {
    getModels().then(data => {
      setAvailableModels(data.models || [])
      setSelectedModel(data.default || 'sonnet')
    })
  }, [])

  async function handleGenerate(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setStreamProgress(null)

    try {
      const result = await generateDwiStream({
        photos,
        documents,
        station,
        stationNummer: selectedStation?.nummer,
        machine,
        beschrijving,
        auteur: auteur || 'Onbekend',
        model: selectedModel,
      }, (progress) => {
        setStreamProgress(progress)
      })
      setGeneratedDwi(result.dwi)
      setStreamProgress(null)
    } catch (err) {
      setError(err.message)
      setStreamProgress(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!generatedDwi) return
    setSaving(true)
    setError(null)

    try {
      await saveDwi(generatedDwi, photos)
      setSaved(true)
      setTimeout(() => navigate(`/dwi/${generatedDwi.id}`), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setGeneratedDwi(null)
    setError(null)
    setStreamProgress(null)
  }

  const canGenerate = station && machine && beschrijving.length >= 10 && photos.length > 0

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-thg-accent hover:text-thg-blue
          font-semibold min-h-[44px] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Terug naar overzicht
      </Link>

      {/* Title */}
      <div className="bg-gradient-to-r from-thg-blue to-thg-blue-light rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Nieuwe DWI aanmaken met AI</h1>
            <p className="text-blue-100 mt-1">
              Upload foto's en beschrijf het proces — Claude genereert de werkinstructie
            </p>
          </div>
        </div>
      </div>

      {/* Saved success */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-thg-green" />
          <div>
            <p className="font-semibold text-green-800">DWI opgeslagen!</p>
            <p className="text-sm text-green-600">Je wordt doorgestuurd naar de werkinstructie...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Er ging iets mis</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Streaming progress */}
      {loading && streamProgress && (
        <StreamProgress progress={streamProgress} />
      )}

      {/* Generated preview */}
      {generatedDwi && !saved && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-semibold text-green-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              DWI gegenereerd! Controleer het resultaat hieronder.
            </p>
          </div>

          <DwiVoorbeeld dwi={generatedDwi} />

          <div className="flex flex-wrap gap-3 sticky bottom-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-thg-green hover:bg-green-600 text-white
                font-semibold py-3 px-6 rounded-lg min-h-[44px] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Opslaan...' : 'Opslaan'}
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-thg-accent hover:bg-blue-600 text-white
                font-semibold py-3 px-6 rounded-lg min-h-[44px] transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-5 h-5" />
              Opnieuw genereren
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700
                font-semibold py-3 px-5 rounded-lg min-h-[44px] hover:bg-gray-50 transition-colors"
            >
              Terug naar formulier
            </button>
          </div>
        </div>
      )}

      {/* Form (hidden when preview is shown) */}
      {!generatedDwi && !saved && (
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Step 1: Basic info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-thg-blue-dark">
              1. Basisgegevens
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station *
                </label>
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px]
                    text-base focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                >
                  <option value="">Kies een station...</option>
                  {WORK_STATIONS.map(s => (
                    <option key={s.code} value={s.code}>
                      {s.nummer} &middot; {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine / Apparaat *
                </label>
                <input
                  type="text"
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                  required
                  placeholder="Bijv. Bohle boormachine"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px]
                    text-base focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auteur / Melder
                </label>
                <input
                  type="text"
                  value={auteur}
                  onChange={(e) => setAuteur(e.target.value)}
                  placeholder="Je naam"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px]
                    text-base focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                />
              </div>

              {/* Model selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Model
                </label>
                <div className="flex gap-2">
                  {availableModels.map(m => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setSelectedModel(m.key)}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all min-h-[44px]
                        ${selectedModel === m.key
                          ? 'bg-thg-blue text-white border-thg-blue shadow-sm'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-thg-accent'
                        }`}
                    >
                      {m.key === 'sonnet' && <Zap className="w-4 h-4 inline mr-1.5" />}
                      {m.key === 'opus' && <Brain className="w-4 h-4 inline mr-1.5" />}
                      {m.label}
                    </button>
                  ))}
                  {availableModels.length === 0 && (
                    <div className="flex-1 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400">
                      Modellen laden...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijving / Context *
              </label>
              <textarea
                value={beschrijving}
                onChange={(e) => setBeschrijving(e.target.value)}
                required
                rows={4}
                placeholder="Beschrijf het proces dat je wilt vastleggen. Bijvoorbeeld: 'Hoe start je de boormachine op en stel je de boorposities in? Eerst machine aanzetten, dan tafel resetten, waterkranen open, nulpunt instellen...'"
                className="w-full border border-gray-300 rounded-lg py-3 px-4
                  text-base focus:ring-2 focus:ring-thg-accent focus:border-thg-accent resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">
                Minimaal 10 tekens. Hoe meer detail, hoe beter de AI-instructie.
              </p>
            </div>
          </div>

          {/* Step 2: Media upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-thg-blue-dark">
              2. Bestanden uploaden
            </h2>
            <p className="text-sm text-gray-500">
              Upload foto's van de machine, knoppen, schermen, en het proces.
              Je kunt ook PDF's, tekstbestanden of ZIP-bestanden (bijv. WhatsApp export) meesturen als extra context.
              Claude analyseert alles en genereert stap-voor-stap instructies met SVG-illustraties.
            </p>
            <MediaUpload
              photos={photos}
              setPhotos={setPhotos}
              documents={documents}
              setDocuments={setDocuments}
            />
          </div>

          {/* Generate button */}
          <button
            type="submit"
            disabled={!canGenerate || loading}
            className={`w-full flex items-center justify-center gap-3 font-bold text-lg
              py-4 px-6 rounded-xl min-h-[56px] transition-all
              ${canGenerate && !loading
                ? 'bg-gradient-to-r from-thg-blue to-thg-accent text-white hover:shadow-lg hover:scale-[1.01]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Claude genereert je DWI...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Genereer DWI met AI
                {selectedModel === 'opus' && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">Opus</span>}
              </>
            )}
          </button>

          {!canGenerate && !loading && (
            <p className="text-center text-sm text-gray-400">
              Vul alle velden in en upload minimaal 1 foto om te genereren.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
