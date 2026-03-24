import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { STATIONS, WERKINSTRUCTIES } from '../data/werkinstructies'
import { getGeneratedDwis, getContext, updateContext, getAnalytics, updateDwiStatus, deleteDwi } from '../utils/dwiService'
import StatusBadge from './StatusBadge'
import {
  Settings, ArrowLeft, Factory, FileText, ClipboardCheck, Pencil,
  Plus, Trash2, Save, Loader2, CheckCircle, AlertTriangle, Cpu,
  BarChart3, Eye, TrendingUp, ShieldCheck,
} from 'lucide-react'
import PincodeModal from './PincodeModal'
import { ALLOWED_TRANSITIONS } from './StatusBadge'

export default function BeheerPagina() {
  const [activeTab, setActiveTab] = useState('beoordeling')
  const [generatedDwis, setGeneratedDwis] = useState([])

  // Context/instellingen state
  const [stationContext, setStationContext] = useState({})
  const [contextLoading, setContextLoading] = useState(false)
  const [contextSaving, setContextSaving] = useState(false)
  const [contextSaved, setContextSaved] = useState(false)
  const [contextError, setContextError] = useState(null)
  const [selectedStation, setSelectedStation] = useState('BOR')

  // Analytics state
  const [analytics, setAnalytics] = useState(null)

  // Status workflow state
  const [pinModal, setPinModal] = useState(null) // { dwiId, targetStatus }
  const [statusUpdating, setStatusUpdating] = useState(null)

  useEffect(() => {
    getGeneratedDwis().then(setGeneratedDwis).catch(() => {})
  }, [])

  // Load analytics when tab is active
  useEffect(() => {
    if (activeTab === 'analytics') {
      getAnalytics().then(setAnalytics).catch(() => {})
    }
  }, [activeTab])

  // Load context when Instellingen tab is active
  useEffect(() => {
    if (activeTab === 'instellingen') {
      setContextLoading(true)
      getContext()
        .then(data => setStationContext(data.stations || {}))
        .catch(() => setContextError('Kon context niet laden'))
        .finally(() => setContextLoading(false))
    }
  }, [activeTab])

  const conceptDwis = useMemo(
    () => generatedDwis.filter(d => d.status === 'concept'),
    [generatedDwis]
  )

  const alleDwis = useMemo(() => {
    const ids = new Set(WERKINSTRUCTIES.map(d => d.id))
    const extra = generatedDwis.filter(d => !ids.has(d.id))
    return [...WERKINSTRUCTIES, ...extra]
  }, [generatedDwis])

  const stats = {
    totaalDwis: alleDwis.length,
    stations: STATIONS.filter(s => s.code !== 'alle').length,
    terBeoordeling: conceptDwis.length,
  }

  // ─── Context helpers ───
  const currentStation = stationContext[selectedStation] || {}

  function updateStationField(field, value) {
    setStationContext(prev => ({
      ...prev,
      [selectedStation]: { ...prev[selectedStation], [field]: value }
    }))
    setContextSaved(false)
  }

  function updateStationArrayItem(field, index, value) {
    const arr = [...(currentStation[field] || [])]
    arr[index] = value
    updateStationField(field, arr)
  }

  function addStationArrayItem(field) {
    updateStationField(field, [...(currentStation[field] || []), ''])
  }

  function removeStationArrayItem(field, index) {
    const arr = [...(currentStation[field] || [])]
    arr.splice(index, 1)
    updateStationField(field, arr)
  }

  async function handleContextSave() {
    setContextSaving(true)
    setContextError(null)
    try {
      await updateContext(stationContext)
      setContextSaved(true)
      setTimeout(() => setContextSaved(false), 3000)
    } catch (err) {
      setContextError(err.message)
    } finally {
      setContextSaving(false)
    }
  }

  // ─── Status workflow helpers ───
  function handleStatusChange(dwiId, targetStatus) {
    if (targetStatus === 'goedgekeurd' || targetStatus === 'gepubliceerd') {
      setPinModal({ dwiId, targetStatus })
    } else {
      doStatusUpdate(dwiId, targetStatus)
    }
  }

  async function doStatusUpdate(dwiId, targetStatus, pin = null) {
    setStatusUpdating(dwiId)
    try {
      await updateDwiStatus(dwiId, targetStatus, pin)
      // Refresh list
      const updated = await getGeneratedDwis()
      setGeneratedDwis(updated)
      setPinModal(null)
    } catch (err) {
      throw err // Let PincodeModal handle the error display
    } finally {
      setStatusUpdating(null)
    }
  }

  async function handleDelete(dwiId) {
    if (!confirm(`Weet je zeker dat je ${dwiId} wilt verwijderen? Dit kan niet ongedaan worden.`)) return
    try {
      await deleteDwi(dwiId)
      setGeneratedDwis(prev => prev.filter(d => d.id !== dwiId))
    } catch (err) {
      alert(`Verwijderen mislukt: ${err.message}`)
    }
  }

  const WORK_STATIONS = STATIONS.filter(s => s.code !== 'alle')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="text-thg-blue hover:underline flex items-center gap-1">
          <ArrowLeft size={18} />
          Terug
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings size={24} />
          Beheer
        </h1>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FileText size={28} className="text-thg-blue" />
          <div>
            <p className="text-2xl font-bold">{stats.totaalDwis}</p>
            <p className="text-sm text-gray-500">Werkinstructies</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <Factory size={28} className="text-thg-blue" />
          <div>
            <p className="text-2xl font-bold">{stats.stations}</p>
            <p className="text-sm text-gray-500">Stations</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ClipboardCheck size={28} className={stats.terBeoordeling > 0 ? 'text-thg-orange' : 'text-thg-green'} />
          <div>
            <p className="text-2xl font-bold">{stats.terBeoordeling}</p>
            <p className="text-sm text-gray-500">Ter beoordeling</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b overflow-x-auto">
        {[
          { key: 'beoordeling', label: `Ter beoordeling (${conceptDwis.length})` },
          { key: 'dwis', label: 'Alle werkinstructies' },
          { key: 'analytics', label: 'Analytics' },
          { key: 'overzicht', label: 'Stations' },
          { key: 'instellingen', label: 'AI Instellingen' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-thg-blue text-thg-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ter beoordeling */}
      {activeTab === 'beoordeling' && (
        <div>
          {conceptDwis.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
              <ClipboardCheck size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Geen DWI's ter beoordeling</p>
              <p className="text-sm mt-1">Alle werkinstructies zijn beoordeeld.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conceptDwis.map(dwi => (
                <div key={dwi.id} className="bg-white rounded-xl shadow p-5 border-l-4 border-thg-orange">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-gray-500">{dwi.id}</span>
                        <StatusBadge status={dwi.status} />
                      </div>
                      <Link to={`/dwi/${dwi.id}`} className="text-lg font-semibold text-thg-blue hover:underline">
                        {dwi.titel}
                      </Link>
                      <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4">
                        <span>Station: <strong>{dwi.station}</strong></span>
                        {dwi.machine && <span>Machine: <strong>{dwi.machine}</strong></span>}
                        <span>Auteur: <strong>{dwi.auteur}</strong></span>
                        {dwi.datum && <span>Aangemaakt: <strong>{dwi.datum}</strong></span>}
                      </div>
                      {dwi.stappen && (
                        <p className="mt-1 text-sm text-gray-400">{dwi.stappen.length} stappen</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 items-end">
                      <div className="flex gap-2">
                        <Link
                          to={`/dwi/${dwi.id}/bewerken`}
                          className="px-3 py-2 bg-thg-accent text-white rounded-lg hover:bg-thg-blue text-sm font-medium flex items-center gap-1"
                        >
                          <Pencil size={14} />
                          Bewerken
                        </Link>
                        <Link
                          to={`/dwi/${dwi.id}`}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                        >
                          Bekijken
                        </Link>
                      </div>
                      {/* Status workflow buttons */}
                      <div className="flex gap-1.5">
                        {(ALLOWED_TRANSITIONS[dwi.status] || []).map(nextStatus => (
                          <button
                            key={nextStatus}
                            onClick={() => handleStatusChange(dwi.id, nextStatus)}
                            disabled={statusUpdating === dwi.id}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50
                              ${nextStatus === 'goedgekeurd' || nextStatus === 'gepubliceerd'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : nextStatus === 'review'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                          >
                            {nextStatus === 'goedgekeurd' && <ShieldCheck size={12} className="inline mr-1" />}
                            {nextStatus === 'review' ? 'Ter review' : nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                          </button>
                        ))}
                        <button
                          onClick={() => handleDelete(dwi.id)}
                          className="px-2 py-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Verwijderen"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Alle werkinstructies */}
      {activeTab === 'dwis' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Titel</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Station</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Versie</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {alleDwis.map(dwi => (
                <tr key={dwi.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{dwi.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link to={`/dwi/${dwi.id}`} className="text-thg-blue hover:underline font-medium">
                      {dwi.titel}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">{dwi.station}</td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status={dwi.status} /></td>
                  <td className="px-4 py-3 text-sm">{dwi.versie || '1.0'}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link to={`/dwi/${dwi.id}/bewerken`}
                      className="text-thg-accent hover:text-thg-blue flex items-center gap-1">
                      <Pencil size={12} /> Bewerken
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pincode Modal */}
      {pinModal && (
        <PincodeModal
          open={!!pinModal}
          onClose={() => setPinModal(null)}
          onSubmit={(pin) => doStatusUpdate(pinModal.dwiId, pinModal.targetStatus, pin)}
          laden={statusUpdating === pinModal?.dwiId}
        />
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {!analytics ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-thg-blue" />
              <p className="mt-2 text-gray-500 text-sm">Laden...</p>
            </div>
          ) : (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
                  <Eye size={28} className="text-thg-blue" />
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalViews}</p>
                    <p className="text-sm text-gray-500">Totaal views</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
                  <TrendingUp size={28} className="text-thg-green" />
                  <div>
                    <p className="text-2xl font-bold">
                      {analytics.last30.reduce((sum, d) => sum + d.views, 0)}
                    </p>
                    <p className="text-sm text-gray-500">Views (30 dagen)</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
                  <BarChart3 size={28} className="text-thg-accent" />
                  <div>
                    <p className="text-2xl font-bold">{analytics.top10.length}</p>
                    <p className="text-sm text-gray-500">Actieve DWI's</p>
                  </div>
                </div>
              </div>

              {/* Simple bar chart — last 30 days */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold text-thg-blue-dark mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Views per dag (laatste 30 dagen)
                </h3>
                <div className="flex items-end gap-1 h-32">
                  {analytics.last30.map((day, i) => {
                    const max = Math.max(...analytics.last30.map(d => d.views), 1)
                    const height = day.views > 0 ? Math.max((day.views / max) * 100, 4) : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                        <div
                          className="w-full bg-thg-blue rounded-t transition-all hover:bg-thg-accent"
                          style={{ height: `${height}%` }}
                          title={`${day.datum}: ${day.views} views`}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 bg-gray-800 text-white text-xs px-2 py-1
                          rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {day.datum.slice(5)}: {day.views}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{analytics.last30[0]?.datum.slice(5)}</span>
                  <span>Vandaag</span>
                </div>
              </div>

              {/* Top 10 most viewed */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-5 py-4 border-b">
                  <h3 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2">
                    <TrendingUp size={20} />
                    Top 10 meest bekeken
                  </h3>
                </div>
                {analytics.top10.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Eye size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Nog geen views geregistreerd.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-sm font-medium text-gray-600">#</th>
                        <th className="px-5 py-3 text-sm font-medium text-gray-600">DWI</th>
                        <th className="px-5 py-3 text-sm font-medium text-gray-600 text-right">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {analytics.top10.map((item, i) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-sm font-bold text-thg-blue">{i + 1}</td>
                          <td className="px-5 py-3 text-sm">
                            <Link to={`/dwi/${item.id}`} className="text-thg-blue hover:underline font-medium">
                              {item.id}
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-sm text-right font-semibold">{item.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Recent views */}
              {analytics.recent.length > 0 && (
                <div className="bg-white rounded-xl shadow p-5">
                  <h3 className="text-lg font-semibold text-thg-blue-dark mb-3 flex items-center gap-2">
                    <Eye size={20} />
                    Recente views
                  </h3>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {analytics.recent.slice(0, 20).map((v, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                        <Link to={`/dwi/${v.dwiId}`} className="text-thg-blue hover:underline font-medium">
                          {v.dwiId}
                        </Link>
                        <span className="text-gray-400 text-xs">
                          {new Date(v.timestamp).toLocaleString('nl-NL', {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Stations */}
      {activeTab === 'overzicht' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Nr</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Station</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 text-right">DWI's</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {STATIONS.filter(s => s.code !== 'alle').map(station => (
                <tr key={station.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{station.nummer}</td>
                  <td className="px-4 py-3 text-sm font-mono">{station.code}</td>
                  <td className="px-4 py-3 text-sm font-medium">{station.label}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    {alleDwis.filter(d => d.station === station.code).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══════════ AI INSTELLINGEN ═══════════ */}
      {activeTab === 'instellingen' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-thg-blue to-thg-blue-light rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold">AI Context — Bedrijfskennis</h2>
                <p className="text-blue-100 text-sm">
                  Deze gegevens worden automatisch meegegeven aan Claude bij het genereren van DWI's.
                  Hoe meer context, hoe beter de gegenereerde instructies.
                </p>
              </div>
            </div>
          </div>

          {contextSaved && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-thg-green" />
              <p className="text-green-800 font-medium text-sm">Instellingen opgeslagen!</p>
            </div>
          )}
          {contextError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{contextError}</p>
            </div>
          )}

          {contextLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-thg-blue" />
              <p className="mt-2 text-gray-500 text-sm">Laden...</p>
            </div>
          ) : (
            <>
              {/* Station selector */}
              <div className="bg-white rounded-xl shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kies station om te bewerken
                </label>
                <div className="flex flex-wrap gap-2">
                  {WORK_STATIONS.map(s => (
                    <button
                      key={s.code}
                      onClick={() => setSelectedStation(s.code)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedStation === s.code
                          ? 'bg-thg-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Station details editor */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 space-y-5">
                <h3 className="text-lg font-semibold text-thg-blue-dark">
                  {selectedStation} — {WORK_STATIONS.find(s => s.code === selectedStation)?.label}
                </h3>

                {/* Beschrijving */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Beschrijving</label>
                  <textarea
                    value={currentStation.beschrijving || ''}
                    onChange={(e) => updateStationField('beschrijving', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                      focus:ring-2 focus:ring-thg-accent focus:border-thg-accent resize-y"
                    placeholder="Beschrijving van dit station..."
                  />
                </div>

                {/* Machines */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-500">Machines</label>
                    <button onClick={() => addStationArrayItem('machines')}
                      className="text-xs text-thg-accent hover:text-thg-blue flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Machine toevoegen
                    </button>
                  </div>
                  {(currentStation.machines || []).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <Cpu className="w-3 h-3 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => updateStationArrayItem('machines', i, e.target.value)}
                        className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm
                          focus:ring-1 focus:ring-thg-accent"
                        placeholder="Machine naam + merk..."
                      />
                      <button onClick={() => removeStationArrayItem('machines', i)}
                        className="text-red-400 hover:text-red-600 p-0.5">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Processen */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-500">Processen</label>
                    <button onClick={() => addStationArrayItem('processen')}
                      className="text-xs text-thg-accent hover:text-thg-blue flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Proces toevoegen
                    </button>
                  </div>
                  {(currentStation.processen || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 bg-thg-accent rounded-full shrink-0" />
                      <input
                        type="text"
                        value={p}
                        onChange={(e) => updateStationArrayItem('processen', i, e.target.value)}
                        className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm
                          focus:ring-1 focus:ring-thg-accent"
                        placeholder="Proces beschrijving..."
                      />
                      <button onClick={() => removeStationArrayItem('processen', i)}
                        className="text-red-400 hover:text-red-600 p-0.5">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* PBM */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-500">PBM (Veiligheid)</label>
                    <button onClick={() => addStationArrayItem('pbm')}
                      className="text-xs text-thg-accent hover:text-thg-blue flex items-center gap-1">
                      <Plus className="w-3 h-3" /> PBM toevoegen
                    </button>
                  </div>
                  {(currentStation.pbm || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 bg-thg-orange rounded-full shrink-0" />
                      <input
                        type="text"
                        value={p}
                        onChange={(e) => updateStationArrayItem('pbm', i, e.target.value)}
                        className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm
                          focus:ring-1 focus:ring-thg-accent"
                        placeholder="PBM item..."
                      />
                      <button onClick={() => removeStationArrayItem('pbm', i)}
                        className="text-red-400 hover:text-red-600 p-0.5">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Kritische regels */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-orange-600">Kritische regels</label>
                    <button onClick={() => addStationArrayItem('kritischRegels')}
                      className="text-xs text-thg-accent hover:text-thg-blue flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Regel toevoegen
                    </button>
                  </div>
                  {(currentStation.kritischRegels || []).map((r, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-3 h-3 text-thg-orange shrink-0" />
                      <input
                        type="text"
                        value={r}
                        onChange={(e) => updateStationArrayItem('kritischRegels', i, e.target.value)}
                        className="flex-1 border border-orange-200 bg-orange-50 rounded px-2 py-1 text-sm
                          focus:ring-1 focus:ring-orange-400"
                        placeholder="Kritische veiligheidsregel..."
                      />
                      <button onClick={() => removeStationArrayItem('kritischRegels', i)}
                        className="text-red-400 hover:text-red-600 p-0.5">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleContextSave}
                disabled={contextSaving}
                className="w-full flex items-center justify-center gap-2 bg-thg-green hover:bg-green-600
                  text-white font-semibold py-3 px-6 rounded-xl min-h-[44px] transition-colors
                  disabled:opacity-50"
              >
                {contextSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {contextSaving ? 'Opslaan...' : 'Context opslaan'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
