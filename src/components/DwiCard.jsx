import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle, Edit3, Trash2 } from 'lucide-react'
import { STATIONS } from '../data/werkinstructies'
import StatusBadge from './StatusBadge'

function getStationLabel(code) {
  const s = STATIONS.find((st) => st.code === code)
  return s ? s.label : code
}

export default function DwiCard({ dwi, onGoedkeuren, onAfkeuren }) {
  const navigate = useNavigate()

  // Count total steps (handle both secties and stappen)
  const aantalStappen = dwi.secties
    ? dwi.secties.reduce((sum, sec) => sum + sec.stappen.length, 0)
    : dwi.stappen?.length || 0

  const isConcept = dwi.status === 'concept'

  const handleRevisie = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Navigate to new DWI page with this DWI's data for editing
    navigate('/nieuw', { state: { revisie: dwi } })
  }

  const handleGoedkeuren = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onGoedkeuren) onGoedkeuren(dwi)
  }

  const handleAfkeuren = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAfkeuren) onAfkeuren(dwi)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-thg-blue hover:shadow-md transition-shadow">
      <Link to={`/dwi/${dwi.id}`} className="block">
        <div className="p-4 md:p-5">
          <p className="text-xs font-bold text-thg-accent uppercase tracking-wide">
            {dwi.id}
          </p>
          <h3 className="text-lg font-bold text-thg-blue-dark mt-1 leading-snug">
            {dwi.titel}
          </h3>
          <span className="inline-block bg-blue-50 text-thg-blue text-xs font-semibold px-3 py-1 rounded-full mt-2">
            {dwi.stationNummer} &middot; {getStationLabel(dwi.station)}
          </span>
          <p className="text-sm text-thg-gray mt-2 leading-relaxed">
            {dwi.machine}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {aantalStappen} stappen &middot; {dwi.pbm.length} PBM &middot; {dwi.gereedschap.length} gereedschap
          </p>
        </div>
        <div className="px-4 md:px-5 py-3 bg-gray-50 flex items-center justify-between text-xs text-thg-gray">
          <StatusBadge status={dwi.status} />
          <span className="flex items-center gap-1">
            v{dwi.versie} &middot; {dwi.datum} &middot; {dwi.auteur}
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Actieknoppen voor concept DWI's */}
      {isConcept && (
        <div className="px-4 md:px-5 py-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={handleGoedkeuren}
            className="flex-1 flex items-center justify-center gap-2 bg-thg-green text-white py-2 px-3 rounded-lg
              text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Goedkeuren
          </button>
          <button
            onClick={handleRevisie}
            className="flex-1 flex items-center justify-center gap-2 bg-thg-blue text-white py-2 px-3 rounded-lg
              text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Revisie
          </button>
          <button
            onClick={handleAfkeuren}
            className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-3 rounded-lg
              text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
