import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, ClipboardList, Save, Loader2, AlertTriangle,
  BarChart3, Calendar, User, ChevronDown, ChevronUp, Star,
} from 'lucide-react'
import { STATIONS } from '../data/werkinstructies'
import {
  VIJF_S_CATEGORIEEN, VIJF_S_SCORES, DEFAULT_CHECKLIST_ITEMS,
  STATION_SPECIFIEK,
} from '../data/vijfS'

const WORK_STATIONS = STATIONS.filter(s => s.code !== 'alle')

function getChecklistItems(stationCode, categorie) {
  const defaults = DEFAULT_CHECKLIST_ITEMS[categorie] || []
  const extra = STATION_SPECIFIEK[stationCode]?.[categorie] || []
  return [...defaults, ...extra]
}

function ScoreKnop({ waarde, actief, onClick }) {
  const score = VIJF_S_SCORES[waarde]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 rounded-full text-xs font-bold transition-all
        ${actief ? score.kleur + ' ring-2 ring-offset-1 ring-gray-400 scale-110' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
      title={score.label}
    >
      {waarde}
    </button>
  )
}

function CategorieBlok({ categorie, items, scores, onScoreChange, openState, onToggle }) {
  const gemiddelde = items.length > 0
    ? items.reduce((sum, _, i) => sum + (scores[i] || 0), 0) / items.length
    : 0
  const afgerond = Math.round(gemiddelde * 10) / 10

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${categorie.kleur}`} />
          <div className="text-left">
            <h3 className="font-semibold text-thg-blue-dark">{categorie.label}</h3>
            <p className="text-xs text-gray-500">{categorie.omschrijving}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`text-lg font-bold ${afgerond >= 4 ? 'text-green-600' : afgerond >= 3 ? 'text-yellow-600' : afgerond >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              {afgerond > 0 ? afgerond : '-'}
            </span>
            <span className="text-xs text-gray-400">/5</span>
          </div>
          {openState ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {openState && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 text-sm text-gray-700 pt-1">{item}</div>
              <div className="flex gap-1 shrink-0">
                {[0, 1, 2, 3, 4, 5].map(waarde => (
                  <ScoreKnop
                    key={waarde}
                    waarde={waarde}
                    actief={scores[i] === waarde}
                    onClick={() => onScoreChange(i, waarde)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function VijfSPagina() {
  const [station, setStation] = useState('BOR')
  const [auditor, setAuditor] = useState('')
  const [scores, setScores] = useState({}) // { [categorie]: [score per item] }
  const [openCategorie, setOpenCategorie] = useState('sorteren')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [historie, setHistorie] = useState([])

  // Load history
  useEffect(() => {
    fetch(`/api/vijfs/${station}/historie`)
      .then(r => r.ok ? r.json() : { audits: [] })
      .then(data => setHistorie(data.audits || []))
      .catch(() => {})
  }, [station])

  // Build items per category for current station
  const categorieItems = useMemo(() => {
    const result = {}
    for (const cat of VIJF_S_CATEGORIEEN) {
      result[cat.key] = getChecklistItems(station, cat.key)
    }
    return result
  }, [station])

  // Reset scores when station changes
  useEffect(() => {
    const init = {}
    for (const cat of VIJF_S_CATEGORIEEN) {
      init[cat.key] = new Array(categorieItems[cat.key].length).fill(0)
    }
    setScores(init)
    setSaved(false)
  }, [station, categorieItems])

  function handleScoreChange(categorie, index, waarde) {
    setScores(prev => {
      const arr = [...(prev[categorie] || [])]
      arr[index] = waarde
      return { ...prev, [categorie]: arr }
    })
    setSaved(false)
  }

  // Calculate totals
  const totaalScores = useMemo(() => {
    const result = {}
    let totaal = 0
    let items = 0
    for (const cat of VIJF_S_CATEGORIEEN) {
      const catScores = scores[cat.key] || []
      const catItems = categorieItems[cat.key] || []
      const catTotaal = catScores.reduce((s, v) => s + (v || 0), 0)
      const catMax = catItems.length * 5
      result[cat.key] = { score: catTotaal, max: catMax, percentage: catMax > 0 ? Math.round(catTotaal / catMax * 100) : 0 }
      totaal += catTotaal
      items += catItems.length
    }
    result._totaal = { score: totaal, max: items * 5, percentage: items > 0 ? Math.round(totaal / (items * 5) * 100) : 0 }
    return result
  }, [scores, categorieItems])

  async function handleSave() {
    if (!auditor.trim()) {
      setError('Vul je naam in als auditor.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/vijfs/${station}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          station,
          auditor: auditor.trim(),
          scores,
          totaalScores,
          datum: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Opslaan mislukt')
      setSaved(true)
      // Refresh history
      const histRes = await fetch(`/api/vijfs/${station}/historie`)
      if (histRes.ok) {
        const data = await histRes.json()
        setHistorie(data.audits || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const selectedStation = WORK_STATIONS.find(s => s.code === station)

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-thg-accent hover:text-thg-blue font-semibold min-h-[44px] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Terug naar overzicht
      </Link>

      {/* Title */}
      <div className="bg-gradient-to-r from-thg-blue to-thg-blue-light rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">5S Audit</h1>
            <p className="text-white/80 mt-1">
              Beoordeel de werkplek op de 5 S&apos;en
            </p>
          </div>
        </div>
      </div>

      {/* Station + auditor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px] text-base
                focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
            >
              {WORK_STATIONS.map(s => (
                <option key={s.code} value={s.code}>
                  {s.nummer} &middot; {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auditor</label>
            <input
              type="text"
              value={auditor}
              onChange={(e) => setAuditor(e.target.value)}
              placeholder="Je naam"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px] text-base
                focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
            />
          </div>
        </div>

        {/* Score summary bar */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
          <BarChart3 className="w-5 h-5 text-thg-blue" />
          <div className="flex-1 flex gap-2">
            {VIJF_S_CATEGORIEEN.map(cat => (
              <div key={cat.key} className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.kleur} transition-all duration-300`}
                    style={{ width: `${totaalScores[cat.key]?.percentage || 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 text-center truncate">{cat.key.slice(0, 3).toUpperCase()}</p>
              </div>
            ))}
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${totaalScores._totaal.percentage >= 80 ? 'text-green-600' : totaalScores._totaal.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {totaalScores._totaal.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-thg-green" />
          <p className="text-green-800 font-medium">5S audit opgeslagen voor {selectedStation?.label}!</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {VIJF_S_CATEGORIEEN.map(cat => (
          <CategorieBlok
            key={cat.key}
            categorie={cat}
            items={categorieItems[cat.key]}
            scores={scores[cat.key] || []}
            onScoreChange={(i, v) => handleScoreChange(cat.key, i, v)}
            openState={openCategorie === cat.key}
            onToggle={() => setOpenCategorie(openCategorie === cat.key ? null : cat.key)}
          />
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-thg-green hover:bg-green-600
          text-white font-bold text-lg py-4 rounded-xl min-h-[56px] transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
        {saving ? 'Opslaan...' : 'Audit opslaan'}
      </button>

      {/* History */}
      {historie.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-thg-blue-dark mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Audit historie — {selectedStation?.label}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2 pr-4 text-left font-semibold text-gray-600">Datum</th>
                  <th className="py-2 pr-4 text-left font-semibold text-gray-600">Auditor</th>
                  {VIJF_S_CATEGORIEEN.map(cat => (
                    <th key={cat.key} className="py-2 px-2 text-center font-semibold text-gray-600">
                      <div className={`w-3 h-3 rounded-full ${cat.kleur} mx-auto mb-0.5`} />
                      {cat.key.slice(0, 3).toUpperCase()}
                    </th>
                  ))}
                  <th className="py-2 pl-2 text-center font-bold text-gray-600">Totaal</th>
                </tr>
              </thead>
              <tbody>
                {historie.slice(0, 10).map((audit, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 pr-4 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {new Date(audit.datum).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="py-2 pr-4 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-gray-400" />
                      {audit.auditor}
                    </td>
                    {VIJF_S_CATEGORIEEN.map(cat => (
                      <td key={cat.key} className="py-2 px-2 text-center font-medium">
                        <span className={`${audit.totaalScores?.[cat.key]?.percentage >= 80 ? 'text-green-600' : audit.totaalScores?.[cat.key]?.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {audit.totaalScores?.[cat.key]?.percentage ?? '-'}%
                        </span>
                      </td>
                    ))}
                    <td className="py-2 pl-2 text-center">
                      <span className={`font-bold ${audit.totaalScores?._totaal?.percentage >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                        {audit.totaalScores?._totaal?.percentage ?? '-'}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
