import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { STATIONS } from '../data/werkinstructies'
import StatusBadge from './StatusBadge'

function getStationLabel(code) {
  const s = STATIONS.find((st) => st.code === code)
  return s ? s.label : code
}

export default function DwiCard({ dwi }) {
  // Count total steps (handle both secties and stappen)
  const aantalStappen = dwi.secties
    ? dwi.secties.reduce((sum, sec) => sum + sec.stappen.length, 0)
    : dwi.stappen?.length || 0

  return (
    <Link
      to={`/dwi/${dwi.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-200
        border-l-4 border-l-thg-blue block
        hover:shadow-md active:shadow-md transition-shadow cursor-pointer"
    >
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
      <div className="px-4 md:px-5 py-3 bg-gray-50 rounded-b-xl flex items-center justify-between text-xs text-thg-gray">
        <StatusBadge status={dwi.status} />
        <span className="flex items-center gap-1">
          v{dwi.versie} &middot; {dwi.datum} &middot; {dwi.auteur}
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
