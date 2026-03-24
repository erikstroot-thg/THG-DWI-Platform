import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft, Sparkles, Save, RotateCcw, Loader2, CheckCircle,
  AlertTriangle, Brain, Cpu, Zap, Edit3, Camera, ImagePlus,
  X, ChevronUp, ChevronDown, Plus, GripVertical, FileText,
  FileArchive, File,
} from 'lucide-react'
import { STATIONS } from '../data/werkinstructies'
import DwiVoorbeeld from './DwiVoorbeeld'
import { generateDwiStream, saveDwi, getModels } from '../utils/dwiService'

const WORK_STATIONS = STATIONS.filter(s => s.code !== 'alle')
const MAX_WIDTH = 1920

// ─── Image resize (shared with MediaUpload) ───
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

// ─── Streaming progress indicator ───
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

// ─── Single step block ───
function StapBlok({ stap, index, total, onFotoChange, onTekstChange, onRemove, onMove }) {
  function openCamera() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      if (e.target.files[0]) onFotoChange(e.target.files[0])
    }
    input.click()
  }

  function openFilePicker() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      if (e.target.files[0]) onFotoChange(e.target.files[0])
    }
    input.click()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-300" />
          <span className="bg-thg-blue text-white text-sm font-bold px-3 py-1 rounded-full">
            Stap {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="p-1.5 text-gray-400 hover:text-thg-blue disabled:opacity-30 transition-colors"
            title="Omhoog"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="p-1.5 text-gray-400 hover:text-thg-blue disabled:opacity-30 transition-colors"
            title="Omlaag"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          {total > 1 && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors ml-1"
              title="Verwijder stap"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Photo area */}
      {stap.foto ? (
        <div className="relative group">
          <img
            src={stap.foto.base64}
            alt={`Stap ${index + 1}`}
            className="w-full max-h-72 object-contain rounded-lg bg-gray-50 border border-gray-100"
          />
          <button
            type="button"
            onClick={() => onFotoChange(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5
              opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            title="Foto verwijderen"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openCamera}
            className="flex-1 flex items-center justify-center gap-2 bg-thg-blue text-white
              font-medium py-3 px-4 rounded-lg min-h-[52px] hover:bg-thg-blue-light transition-colors"
          >
            <Camera className="w-5 h-5" />
            Foto maken
          </button>
          <button
            type="button"
            onClick={openFilePicker}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300
              text-gray-700 font-medium py-3 px-4 rounded-lg min-h-[52px] hover:bg-gray-50 transition-colors"
          >
            <ImagePlus className="w-5 h-5" />
            Bestand kiezen
          </button>
        </div>
      )}

      {/* Text description */}
      <textarea
        value={stap.tekst}
        onChange={(e) => onTekstChange(e.target.value)}
        placeholder="Wat moet de operator hier doen? (optioneel — AI vult aan op basis van de foto)"
        rows={2}
        className="w-full border border-gray-300 rounded-lg py-3 px-4 text-base
          focus:ring-2 focus:ring-thg-accent focus:border-thg-accent resize-y"
      />
    </div>
  )
}

// ─── Document icon helper ───
function getDocIcon(type) {
  if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />
  if (type === 'zip') return <FileArchive className="w-5 h-5 text-yellow-600" />
  if (type === 'text') return <FileText className="w-5 h-5 text-blue-500" />
  return <File className="w-5 h-5 text-gray-500" />
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function NieuwDwiPagina() {
  const navigate = useNavigate()
  const location = useLocation()
  const revisieData = location.state?.revisie || null
  const lastStapRef = useRef(null)

  // Basic info
  const [titel, setTitel] = useState('')
  const [station, setStation] = useState('')
  const [machine, setMachine] = useState('')
  const [auteur, setAuteur] = useState('')
  const [selectedModel, setSelectedModel] = useState('sonnet')
  const [availableModels, setAvailableModels] = useState([])

  // Step-by-step builder
  const [stappen, setStappen] = useState([{ foto: null, tekst: '' }])

  // Extra documents (PDF, TXT, ZIP — optional context)
  const [documents, setDocuments] = useState([])
  const docInputRef = useRef(null)

  // Generation state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedDwi, setGeneratedDwi] = useState(null)
  const [streamProgress, setStreamProgress] = useState(null)

  // Save state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Pre-fill for revisie
  useEffect(() => {
    if (revisieData) {
      setTitel(revisieData.titel || '')
      setStation(revisieData.station || '')
      setMachine(revisieData.machine || '')
      setAuteur(revisieData.auteur || '')
      setGeneratedDwi(revisieData)
    }
  }, [revisieData])

  const selectedStation = WORK_STATIONS.find(s => s.code === station)

  // Load models
  useEffect(() => {
    getModels().then(data => {
      setAvailableModels(data.models || [])
      setSelectedModel(data.default || 'sonnet')
    })
  }, [])

  // ─── Step management ───
  function addStap() {
    setStappen(prev => [...prev, { foto: null, tekst: '' }])
    setTimeout(() => lastStapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  function removeStap(index) {
    setStappen(prev => prev.filter((_, i) => i !== index))
  }

  function moveStap(index, direction) {
    setStappen(prev => {
      const arr = [...prev]
      const target = index + direction
      if (target < 0 || target >= arr.length) return arr
      ;[arr[index], arr[target]] = [arr[target], arr[index]]
      return arr
    })
  }

  async function handleStapFoto(index, file) {
    if (!file) {
      // Remove photo
      setStappen(prev => prev.map((s, i) => i === index ? { ...s, foto: null } : s))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Foto is te groot (max 5MB)')
      return
    }
    const base64 = await resizeImage(file)
    setStappen(prev => prev.map((s, i) =>
      i === index ? { ...s, foto: { base64, mimeType: 'image/jpeg', name: file.name } } : s
    ))
  }

  function handleStapTekst(index, tekst) {
    setStappen(prev => prev.map((s, i) => i === index ? { ...s, tekst } : s))
  }

  // ─── Document upload ───
  async function handleDocumentFiles(fileList) {
    for (const file of Array.from(fileList)) {
      if (file.size > 5 * 1024 * 1024) continue
      if (file.type === 'application/pdf') {
        const base64 = await readFileAsBase64(file)
        setDocuments(prev => [...prev, { type: 'pdf', filename: file.name, base64, size: file.size }])
      } else if (file.type === 'text/plain') {
        const content = await readFileAsText(file)
        setDocuments(prev => [...prev, { type: 'text', filename: file.name, content, size: file.size }])
      } else if (file.type.includes('zip') || file.name.endsWith('.zip')) {
        const base64 = await readFileAsBase64(file)
        setDocuments(prev => [...prev, { type: 'zip', filename: file.name, base64, size: file.size }])
      }
    }
  }

  // ─── Generate ───
  const fotosCount = stappen.filter(s => s.foto).length
  const canGenerate = station && machine && fotosCount > 0

  async function handleGenerate(e) {
    e?.preventDefault()
    setError(null)
    setLoading(true)
    setStreamProgress(null)

    // Build photos array + beschrijving from stappen
    const photos = stappen.filter(s => s.foto).map(s => s.foto)
    const stapBeschrijvingen = stappen.map((s, i) =>
      `Stap ${i + 1}: ${s.tekst || '(geen beschrijving — analyseer de foto)'}`
    ).join('\n')

    const beschrijving = [
      titel ? `Titel: ${titel}` : '',
      '',
      'Stappen van de operator:',
      stapBeschrijvingen,
    ].filter(Boolean).join('\n')

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
      const photos = stappen.filter(s => s.foto).map(s => s.foto)
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

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-thg-accent hover:text-thg-blue font-semibold min-h-[44px] transition-colors">
        <ArrowLeft className="w-5 h-5" /> Terug naar overzicht
      </Link>

      {/* Header */}
      <div className={`rounded-xl p-6 text-white ${revisieData ? 'bg-gradient-to-r from-thg-orange to-orange-400' : 'bg-gradient-to-r from-thg-blue to-thg-blue-light'}`}>
        <div className="flex items-center gap-3">
          {revisieData ? <Edit3 className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
          <div>
            <h1 className="text-2xl font-bold">
              {revisieData ? `Revisie: ${revisieData.id}` : 'Nieuwe DWI aanmaken'}
            </h1>
            <p className="text-white/80 mt-1">
              {revisieData
                ? 'Bewerk de DWI en sla opnieuw op als concept'
                : 'Bouw stap voor stap je werkinstructie op — maak foto\'s en beschrijf wat je doet'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-thg-green" />
          <div>
            <p className="font-semibold text-green-800">DWI opgeslagen!</p>
            <p className="text-sm text-green-600">Je wordt doorgestuurd naar de werkinstructie...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Er ging iets mis</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
      {loading && streamProgress && <StreamProgress progress={streamProgress} />}

      {/* ═══ Generated preview ═══ */}
      {generatedDwi && !saved && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-semibold text-green-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {revisieData ? 'DWI geladen voor revisie.' : 'DWI gegenereerd! Controleer het resultaat.'}
            </p>
          </div>

          <DwiVoorbeeld dwi={generatedDwi} />

          <div className="flex flex-wrap gap-3 sticky bottom-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-200">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-thg-green hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg min-h-[44px] transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Opslaan...' : 'Opslaan als concept'}
            </button>
            {!revisieData && (
              <button onClick={handleGenerate} disabled={loading}
                className="flex items-center gap-2 bg-thg-accent hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg min-h-[44px] transition-colors disabled:opacity-50">
                <RotateCcw className="w-5 h-5" /> Opnieuw genereren
              </button>
            )}
            <button onClick={handleReset}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-5 rounded-lg min-h-[44px] hover:bg-gray-50 transition-colors">
              Terug naar formulier
            </button>
          </div>
        </div>
      )}

      {/* ═══ BUILDER FORM ═══ */}
      {!generatedDwi && !saved && (
        <form onSubmit={handleGenerate} className="space-y-6">

          {/* 1. Basic info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-thg-blue-dark">
              1. Basisgegevens
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
              <input
                type="text" value={titel} onChange={(e) => setTitel(e.target.value)}
                required placeholder="Bijv. Boormachine Opstarten, Slijpschijf Vervangen"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px] text-base
                  focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station *</label>
                <select value={station} onChange={(e) => setStation(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px] text-base
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent">
                  <option value="">Kies een station...</option>
                  {WORK_STATIONS.map(s => (
                    <option key={s.code} value={s.code}>{s.nummer} &middot; {s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Machine / Apparaat *</label>
                <input type="text" value={machine} onChange={(e) => setMachine(e.target.value)}
                  required placeholder="Bijv. Bohle boormachine"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px] text-base
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                <input type="text" value={auteur} onChange={(e) => setAuteur(e.target.value)}
                  placeholder="Je naam"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px] text-base
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
                <div className="flex gap-2">
                  {availableModels.map(m => (
                    <button key={m.key} type="button" onClick={() => setSelectedModel(m.key)}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all min-h-[44px]
                        ${selectedModel === m.key
                          ? 'bg-thg-blue text-white border-thg-blue shadow-sm'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-thg-accent'
                        }`}>
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
          </div>

          {/* 2. Step-by-step builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-thg-blue-dark">
                2. Stappen opbouwen
              </h2>
              <span className="text-sm text-gray-500">
                {fotosCount} foto{fotosCount !== 1 ? "'s" : ''} &middot; {stappen.length} stap{stappen.length !== 1 ? 'pen' : ''}
              </span>
            </div>

            <p className="text-sm text-gray-500 -mt-2">
              Maak per stap een foto en beschrijf kort wat je doet. Claude maakt er een professionele werkinstructie van.
            </p>

            {stappen.map((stap, i) => (
              <div key={i} ref={i === stappen.length - 1 ? lastStapRef : undefined}>
                <StapBlok
                  stap={stap}
                  index={i}
                  total={stappen.length}
                  onFotoChange={(file) => handleStapFoto(i, file)}
                  onTekstChange={(tekst) => handleStapTekst(i, tekst)}
                  onRemove={() => removeStap(i)}
                  onMove={(dir) => moveStap(i, dir)}
                />
              </div>
            ))}

            {/* Add step button */}
            <button
              type="button"
              onClick={addStap}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed
                border-gray-300 rounded-xl text-gray-500 font-medium hover:border-thg-accent
                hover:text-thg-accent transition-colors min-h-[56px]"
            >
              <Plus className="w-5 h-5" />
              Volgende stap toevoegen
            </button>
          </div>

          {/* 3. Extra documents (optional) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-thg-blue-dark">
                3. Extra documenten <span className="text-sm font-normal text-gray-400">(optioneel)</span>
              </h2>
              <button type="button" onClick={() => docInputRef.current?.click()}
                className="text-sm text-thg-accent hover:text-thg-blue font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" /> Toevoegen
              </button>
            </div>
            <p className="text-sm text-gray-500">
              PDF-tekeningen, tekstbestanden of WhatsApp exports als extra context voor de AI.
            </p>
            <input ref={docInputRef} type="file" accept=".pdf,.txt,.zip" multiple className="hidden"
              onChange={(e) => handleDocumentFiles(e.target.files)} />

            {documents.length > 0 && (
              <div className="space-y-2">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    {getDocIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{doc.filename}</p>
                      <p className="text-xs text-gray-400">{doc.type.toUpperCase()} &middot; {(doc.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button type="button" onClick={() => setDocuments(prev => prev.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              <><Loader2 className="w-6 h-6 animate-spin" /> Claude genereert je DWI...</>
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
              {!station ? 'Kies een station' : !machine ? 'Vul de machine in' : fotosCount === 0 ? 'Maak minimaal 1 foto bij een stap' : ''}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
