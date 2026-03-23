import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STATIONS, WERKINSTRUCTIES } from '../data/werkinstructies'
import { Settings, ArrowLeft, Factory, FileText, Users } from 'lucide-react'

export default function BeheerPagina() {
  const [activeTab, setActiveTab] = useState('overzicht')

  const stats = {
    totaalDwis: WERKINSTRUCTIES.length,
    stations: STATIONS.filter(s => s.code !== 'alle').length,
    auteurs: [...new Set(WERKINSTRUCTIES.flatMap(d => d.auteurs || []))].length,
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
          <Users size={28} className="text-thg-blue" />
          <div>
            <p className="text-2xl font-bold">{stats.auteurs}</p>
            <p className="text-sm text-gray-500">Auteurs</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        {[
          { key: 'overzicht', label: 'Stations' },
          { key: 'dwis', label: 'Werkinstructies' },
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

      {/* Tab content */}
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
                    {WERKINSTRUCTIES.filter(d => d.station === station.code).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'dwis' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Titel</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Station</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Versie</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {WERKINSTRUCTIES.map(dwi => (
                <tr key={dwi.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{dwi.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link to={`/dwi/${dwi.id}`} className="text-thg-blue hover:underline font-medium">
                      {dwi.titel}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">{dwi.station}</td>
                  <td className="px-4 py-3 text-sm">{dwi.versie || '1.0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
