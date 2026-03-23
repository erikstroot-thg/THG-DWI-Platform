import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { STATIONS, WERKINSTRUCTIES } from '../data/werkinstructies'
import { getGeneratedDwis } from '../utils/dwiService'
import StatusBadge from './StatusBadge'
import { Settings, ArrowLeft, Factory, FileText, Users, ClipboardCheck, Pencil } from 'lucide-react'

export default function BeheerPagina() {
  const [activeTab, setActiveTab] = useState('beoordeling')
  const [generatedDwis, setGeneratedDwis] = useState([])

  useEffect(() => {
    getGeneratedDwis().then(setGeneratedDwis).catch(() => {})
  }, [])

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
      <div className="flex gap-2 mb-4 border-b">
        {[
          { key: 'beoordeling', label: `Ter beoordeling (${conceptDwis.length})` },
          { key: 'dwis', label: 'Alle werkinstructies' },
          { key: 'overzicht', label: 'Stations' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
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
                    <div className="flex gap-2 shrink-0">
                      <Link
                        to={`/dwi/${dwi.id}/bewerken`}
                        className="px-4 py-2 bg-thg-accent text-white rounded-lg hover:bg-thg-blue text-sm font-medium flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        Bewerken
                      </Link>
                      <Link
                        to={`/dwi/${dwi.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                      >
                        Bekijken
                      </Link>
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
    </div>
  )
}
