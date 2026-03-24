import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Eye,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  History,
  X,
} from 'lucide-react'
import { WERKINSTRUCTIES, STATIONS } from '../data/werkinstructies'
import { getDwi, getGeneratedDwis, updateDwi, copyToGenerated, getDwiHistory } from '../utils/dwiService'
import DwiStapEditor from './DwiStapEditor'
import DwiVoorbeeld from './DwiVoorbeeld'

const WORK_STATIONS = STATIONS.filter(s => s.code !== 'alle')

export default function DwiEditor() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [dwi, setDwi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])
  const [opmerking, setOpmerking] = useState('')
  const [bewerkDoor, setBewerkDoor] = useState('')
  const [dirty, setDirty] = useState(false)

  // Load DWI
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Try generated first
        const fromApi = await getDwi(id)
        if (fromApi) {
          setDwi(fromApi)
          setLoading(false)
          return
        }

        // Try hardcoded — copy to generated for editing
        const hardcoded = WERKINSTRUCTIES.find(w => w.id === id)
        if (hardcoded) {
          const copy = JSON.parse(JSON.stringify(hardcoded))
          await copyToGenerated(copy)
          setDwi(copy)
          setLoading(false)
          return
        }

        // Try from generated list (fallback)
        const all = await getGeneratedDwis()
        const found = all.find(w => w.id === id)
        if (found) {
          setDwi(found)
        } else {
          setError(`DWI ${id} niet gevonden.`)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Load history
  useEffect(() => {
    if (showHistory) {
      getDwiHistory(id).then(setHistory).catch(() => setHistory([]))
    }
  }, [showHistory, id])

  const updateDwiField = useCallback((field, value) => {
    setDwi(prev => ({ ...prev, [field]: value }))
    setDirty(true)
    setSaved(false)
  }, [])

  // ─── Stappen management ───
  function updateStap(index, updatedStap) {
    const stappen = [...(dwi.stappen || [])]
    stappen[index] = updatedStap
    updateDwiField('stappen', stappen)
  }

  function addStap() {
    const stappen = [...(dwi.stappen || [])]
    stappen.push({
      nummer: stappen.length + 1,
      titel: '',
      beschrijving: '',
      waarschuwing: null,
      tip: null,
      substappen: [],
      afbeeldingen: [],
      bijschrift: [],
    })
    updateDwiField('stappen', stappen)
  }

  function removeStap(index) {
    const stappen = [...(dwi.stappen || [])]
    stappen.splice(index, 1)
    // Renumber
    stappen.forEach((s, i) => { s.nummer = i + 1 })
    updateDwiField('stappen', stappen)
  }

  function moveStap(index, direction) {
    const stappen = [...(dwi.stappen || [])]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= stappen.length) return
    ;[stappen[index], stappen[newIndex]] = [stappen[newIndex], stappen[index]]
    stappen.forEach((s, i) => { s.nummer = i + 1 })
    updateDwiField('stappen', stappen)
  }

  // ─── Array field helpers (gereedschap, pbm, afwijkingen) ───
  function updateArrayItem(field, index, value) {
    const arr = [...(dwi[field] || [])]
    arr[index] = value
    updateDwiField(field, arr)
  }

  function addArrayItem(field, template) {
    updateDwiField(field, [...(dwi[field] || []), template])
  }

  function removeArrayItem(field, index) {
    const arr = [...(dwi[field] || [])]
    arr.splice(index, 1)
    updateDwiField(field, arr)
  }

  // ─── Save ───
  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const dwiToSave = { ...dwi, _bewerkDoor: bewerkDoor || 'Onbekend' }
      const result = await updateDwi(id, dwiToSave, { opmerking: opmerking || 'Handmatige bewerking' })
      setDwi(prev => ({ ...prev, versie: result.versie }))
      setSaved(true)
      setDirty(false)
      setOpmerking('')
      // Auto-hide success after 3s
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ─── Loading / Error states ───
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-thg-blue" />
        <p className="mt-3 text-gray-500">DWI laden...</p>
      </div>
    )
  }

  if (error && !dwi) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-20">
        <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
        <p className="mt-3 text-red-600">{error}</p>
        <Link to="/" className="text-thg-accent hover:underline mt-4 inline-block">
          Terug naar overzicht
        </Link>
      </div>
    )
  }

  if (!dwi) return null

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link to={`/dwi/${id}`} className="inline-flex items-center gap-2 text-thg-accent hover:text-thg-blue font-semibold">
          <ArrowLeft className="w-5 h-5" />
          Terug naar detail
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${previewMode
                ? 'bg-thg-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {previewMode ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewMode ? 'Bewerken' : 'Preview'}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <History className="w-4 h-4" />
            Historie
          </button>
        </div>
      </div>

      {/* Title bar */}
      <div className="bg-gradient-to-r from-thg-blue to-thg-blue-light rounded-xl p-4 md:p-6 text-white">
        <div className="flex items-center gap-3">
          <Pencil className="w-6 h-6 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-blue-200 font-mono">{dwi.id} &middot; v{dwi.versie}</p>
            <h1 className="text-xl md:text-2xl font-bold truncate">{dwi.titel || 'Ongetiteld'}</h1>
          </div>
          {dirty && (
            <span className="shrink-0 text-xs bg-white/20 px-2 py-1 rounded-full">
              Niet opgeslagen
            </span>
          )}
        </div>
      </div>

      {/* Success / Error messages */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-thg-green" />
          <p className="font-semibold text-green-800">Opgeslagen als v{dwi.versie}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-thg-blue-dark flex items-center gap-2">
              <History className="w-4 h-4" /> Revisie-historie
            </h2>
            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          {dwi.revisies && dwi.revisies.length > 0 ? (
            <div className="space-y-2">
              {[...dwi.revisies].reverse().map((rev, i) => (
                <div key={i} className="flex items-center gap-3 text-sm border-b border-gray-100 pb-2">
                  <span className="font-mono text-thg-accent font-semibold">v{rev.versie}</span>
                  <span className="text-gray-500">{rev.datum}</span>
                  <span className="text-gray-700">{rev.auteur}</span>
                  <span className="text-gray-400 truncate flex-1">{rev.opmerking}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Nog geen revisies.</p>
          )}
          {history.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                {history.length} opgeslagen versie(s) in history
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ PREVIEW MODE ═══════════ */}
      {previewMode && <DwiVoorbeeld dwi={dwi} />}

      {/* ═══════════ EDIT MODE ═══════════ */}
      {!previewMode && (
        <>
          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-thg-blue-dark">Basisgegevens</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Titel *</label>
                <input
                  type="text"
                  value={dwi.titel || ''}
                  onChange={(e) => updateDwiField('titel', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Machine</label>
                <input
                  type="text"
                  value={dwi.machine || ''}
                  onChange={(e) => updateDwiField('machine', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Station</label>
                <select
                  value={dwi.station || ''}
                  onChange={(e) => {
                    const st = WORK_STATIONS.find(s => s.code === e.target.value)
                    updateDwiField('station', e.target.value)
                    if (st) updateDwiField('stationNummer', st.nummer)
                  }}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                >
                  {WORK_STATIONS.map(s => (
                    <option key={s.code} value={s.code}>{s.nummer} &middot; {s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Auteur</label>
                <input
                  type="text"
                  value={dwi.auteur || ''}
                  onChange={(e) => updateDwiField('auteur', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={dwi.status || 'concept'}
                  onChange={(e) => updateDwiField('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                >
                  <option value="concept">Concept</option>
                  <option value="actief">Actief</option>
                  <option value="gereed">Gereed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Goedgekeurd door</label>
                <input
                  type="text"
                  value={dwi.goedgekeurd || ''}
                  onChange={(e) => updateDwiField('goedgekeurd', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                    focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Zoektermen</label>
              <input
                type="text"
                value={dwi.zoektermen || ''}
                onChange={(e) => updateDwiField('zoektermen', e.target.value)}
                placeholder="zoekwoorden gescheiden door spaties"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                  focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
              />
            </div>
          </div>

          {/* PBM */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-thg-blue-dark">PBM (Veiligheid)</h2>
              <button onClick={() => addArrayItem('pbm', '')}
                className="text-sm text-thg-accent hover:text-thg-blue flex items-center gap-1">
                <Plus className="w-4 h-4" /> Toevoegen
              </button>
            </div>
            <div className="space-y-2">
              {(dwi.pbm || []).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-thg-orange rounded-full shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('pbm', i, e.target.value)}
                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm
                      focus:ring-1 focus:ring-thg-accent"
                  />
                  <button onClick={() => removeArrayItem('pbm', i)}
                    className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Gereedschap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-thg-blue-dark">Gereedschap</h2>
              <button onClick={() => addArrayItem('gereedschap', '')}
                className="text-sm text-thg-accent hover:text-thg-blue flex items-center gap-1">
                <Plus className="w-4 h-4" /> Toevoegen
              </button>
            </div>
            <div className="space-y-2">
              {(dwi.gereedschap || []).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-thg-accent rounded-full shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayItem('gereedschap', i, e.target.value)}
                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm
                      focus:ring-1 focus:ring-thg-accent"
                  />
                  <button onClick={() => removeArrayItem('gereedschap', i)}
                    className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stappen */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-thg-blue-dark">
                Werkstappen ({(dwi.stappen || []).length})
              </h2>
              <button onClick={addStap}
                className="flex items-center gap-2 text-sm font-medium text-white bg-thg-accent
                  hover:bg-thg-blue px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Stap toevoegen
              </button>
            </div>

            {(dwi.stappen || []).map((stap, i) => (
              <DwiStapEditor
                key={`${stap.nummer}-${i}`}
                stap={stap}
                index={i}
                onChange={(updated) => updateStap(i, updated)}
                onRemove={() => removeStap(i)}
                onMoveUp={() => moveStap(i, -1)}
                onMoveDown={() => moveStap(i, 1)}
                isFirst={i === 0}
                isLast={i === (dwi.stappen || []).length - 1}
                dwiContext={dwi ? { titel: dwi.titel, station: dwi.station, machine: dwi.machine } : null}
              />
            ))}
          </div>

          {/* Afwijkingen */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-thg-blue-dark">Afwijkingen & Storingen</h2>
              <button onClick={() => addArrayItem('afwijkingen', { afwijking: '', oorzaak: '', actie: '' })}
                className="text-sm text-thg-accent hover:text-thg-blue flex items-center gap-1">
                <Plus className="w-4 h-4" /> Toevoegen
              </button>
            </div>
            <div className="space-y-3">
              {(dwi.afwijkingen || []).map((a, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={a.afwijking || ''}
                    onChange={(e) => {
                      const arr = [...(dwi.afwijkingen || [])]
                      arr[i] = { ...arr[i], afwijking: e.target.value }
                      updateDwiField('afwijkingen', arr)
                    }}
                    placeholder="Afwijking"
                    className="border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-thg-accent"
                  />
                  <input
                    type="text"
                    value={a.oorzaak || ''}
                    onChange={(e) => {
                      const arr = [...(dwi.afwijkingen || [])]
                      arr[i] = { ...arr[i], oorzaak: e.target.value }
                      updateDwiField('afwijkingen', arr)
                    }}
                    placeholder="Oorzaak"
                    className="border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-thg-accent"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={a.actie || ''}
                      onChange={(e) => {
                        const arr = [...(dwi.afwijkingen || [])]
                        arr[i] = { ...arr[i], actie: e.target.value }
                        updateDwiField('afwijkingen', arr)
                      }}
                      placeholder="Actie"
                      className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-thg-accent"
                    />
                    <button onClick={() => removeArrayItem('afwijkingen', i)}
                      className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════ STICKY SAVE BAR ═══════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={bewerkDoor}
            onChange={(e) => setBewerkDoor(e.target.value)}
            placeholder="Je naam"
            className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-36
              focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
          />
          <input
            type="text"
            value={opmerking}
            onChange={(e) => setOpmerking(e.target.value)}
            placeholder="Wat heb je gewijzigd?"
            className="border border-gray-300 rounded-lg py-2 px-3 text-sm flex-1 min-w-0
              focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
          />
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className={`flex items-center gap-2 font-semibold py-2 px-6 rounded-lg min-h-[44px]
              transition-colors text-sm
              ${dirty && !saving
                ? 'bg-thg-green hover:bg-green-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Opslaan...' : `Opslaan als v${dwi.versie ? (() => { const [maj, min] = dwi.versie.split('.').map(Number); return `${maj}.${min + 1}` })() : '1.1'}`}
          </button>
        </div>
      </div>
    </div>
  )
}
