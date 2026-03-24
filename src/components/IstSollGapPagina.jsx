import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Sparkles, Save, Loader2, AlertTriangle, CheckCircle,
  TrendingUp, TrendingDown, Minus, Target, BarChart3,
} from 'lucide-react'
import { STATIONS } from '../data/werkinstructies'

const WORK_STATIONS = STATIONS.filter(s => s.code !== 'alle')

function ImpactBadge({ impact }) {
  const styles = {
    hoog: 'bg-red-100 text-red-700',
    midden: 'bg-yellow-100 text-yellow-700',
    laag: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[impact] || 'bg-gray-100 text-gray-600'}`}>
      {impact}
    </span>
  )
}

function ScoreBar({ label, score, maxScore = 5 }) {
  const percentage = (score / maxScore) * 100
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-12 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-bold w-6 text-right">{score}</span>
    </div>
  )
}

export default function IstSollGapPagina() {
  const [station, setStation] = useState('BOR')
  const [beschrijving, setBeschrijving] = useState('')
  const [knelpunten, setKnelpunten] = useState('')
  const [auteur, setAuteur] = useState('')

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [analyse, setAnalyse] = useState(null)
  const [bestaande, setBestaande] = useState([])

  // Load existing analyses
  useEffect(() => {
    fetch('/api/ist-soll-gap')
      .then(r => r.ok ? r.json() : { analyses: [] })
      .then(data => setBestaande(data.analyses || []))
      .catch(() => {})
  }, [])

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/ist-soll-gap/${station}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beschrijving, knelpunten }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Generatie mislukt')
      const data = await res.json()
      setAnalyse(data.analyse)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!auteur.trim()) {
      setError('Vul je naam in.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/ist-soll-gap/${station}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...analyse, auteur: auteur.trim() }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Opslaan mislukt')
      setSaved(true)
      // Refresh list
      const listRes = await fetch('/api/ist-soll-gap')
      if (listRes.ok) {
        const data = await listRes.json()
        setBestaande(data.analyses || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const selectedStation = WORK_STATIONS.find(s => s.code === station)
  const stationAnalyses = bestaande.filter(a => a.station === station)

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-thg-accent hover:text-thg-blue font-semibold min-h-[44px]">
        <ArrowLeft className="w-5 h-5" /> Terug naar overzicht
      </Link>

      <div className="bg-gradient-to-r from-thg-orange to-orange-400 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">IST / SOLL / GAP Analyse</h1>
            <p className="text-white/80 mt-1">Analyseer de huidige en gewenste situatie per station</p>
          </div>
        </div>
      </div>

      {/* Input form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
            <select
              value={station}
              onChange={e => { setStation(e.target.value); setAnalyse(null); setSaved(false) }}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px]
                focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
            >
              {WORK_STATIONS.map(s => (
                <option key={s.code} value={s.code}>{s.nummer} &middot; {s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
            <input
              type="text" value={auteur} onChange={e => setAuteur(e.target.value)}
              placeholder="Je naam" className="w-full border border-gray-300 rounded-lg py-3 px-4 min-h-[44px]
                focus:ring-2 focus:ring-thg-accent focus:border-thg-accent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beschrijving huidige situatie (optioneel)
          </label>
          <textarea
            value={beschrijving} onChange={e => setBeschrijving(e.target.value)}
            rows={3} placeholder="Hoe werkt het nu op dit station? Welke processen, machines, werkwijze?"
            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-thg-accent resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bekende knelpunten (optioneel)
          </label>
          <textarea
            value={knelpunten} onChange={e => setKnelpunten(e.target.value)}
            rows={2} placeholder="Welke problemen zie je? Waar gaat het mis? Wat kost te veel tijd?"
            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-thg-accent resize-y"
          />
        </div>
        <button
          onClick={handleGenerate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-thg-blue to-thg-accent
            text-white font-bold py-3 rounded-xl min-h-[48px] hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Claude analyseert...' : 'Genereer IST/SOLL/GAP met AI'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" /> <p className="text-red-700">{error}</p>
        </div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-thg-green" /> <p className="text-green-800 font-medium">Analyse opgeslagen!</p>
        </div>
      )}

      {/* Generated analysis */}
      {analyse && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-thg-blue-dark">{analyse.titel || `Analyse ${selectedStation?.label}`}</h2>

          {analyse.samenvatting && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">{analyse.samenvatting}</p>
            </div>
          )}

          {/* IST vs SOLL comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5" /> IST (huidige situatie)
              </h3>
              <div className="space-y-3">
                {(analyse.ist || []).map((item, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium text-gray-500 uppercase">{item.categorie}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{item.beschrijving}</p>
                    <ScoreBar label="Score" score={item.score} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-green-600 flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5" /> SOLL (gewenste situatie)
              </h3>
              <div className="space-y-3">
                {(analyse.soll || []).map((item, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium text-gray-500 uppercase">{item.categorie}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{item.beschrijving}</p>
                    <ScoreBar label="Doel" score={item.score} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GAP analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-thg-orange flex items-center gap-2 mb-3">
              <Minus className="w-5 h-5" /> GAP (verbeteracties)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 pr-3 text-left font-semibold text-gray-600">Categorie</th>
                    <th className="py-2 pr-3 text-left font-semibold text-gray-600">Verschil</th>
                    <th className="py-2 pr-3 text-left font-semibold text-gray-600">Impact</th>
                    <th className="py-2 pr-3 text-left font-semibold text-gray-600">Actie</th>
                    <th className="py-2 text-left font-semibold text-gray-600">Prio</th>
                  </tr>
                </thead>
                <tbody>
                  {(analyse.gap || []).sort((a, b) => (b.prioriteit || 0) - (a.prioriteit || 0)).map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-3 font-medium">{item.categorie}</td>
                      <td className="py-2 pr-3 text-gray-600">{item.verschil}</td>
                      <td className="py-2 pr-3"><ImpactBadge impact={item.impact} /></td>
                      <td className="py-2 pr-3 text-thg-blue-dark font-medium">{item.actie}</td>
                      <td className="py-2 text-center">
                        <span className="font-bold text-thg-orange">{item.prioriteit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save button */}
          {!saved && (
            <button
              onClick={handleSave} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-thg-green hover:bg-green-600
                text-white font-bold py-3 rounded-xl min-h-[48px] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Opslaan...' : 'Analyse opslaan'}
            </button>
          )}
        </div>
      )}

      {/* Previous analyses */}
      {stationAnalyses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5" /> Eerdere analyses — {selectedStation?.label}
          </h3>
          <div className="space-y-2">
            {stationAnalyses.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-sm">{a.titel || a.id}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.datum).toLocaleDateString('nl-NL')} &middot; {a.auteur}
                  </p>
                </div>
                <span className="text-sm font-medium text-thg-blue">
                  {(a.gap || []).length} acties
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
