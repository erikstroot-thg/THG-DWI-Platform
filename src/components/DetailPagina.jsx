import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Lightbulb,
  User,
  Calendar,
  Hash,
} from 'lucide-react'
import { werkinstructies } from '../data/werkinstructies'
import StatusBadge from './StatusBadge'

export default function DetailPagina() {
  const { id } = useParams()
  const dwi = werkinstructies.find((w) => w.id === id)

  if (!dwi) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 text-center py-20">
        <h2 className="text-xl font-semibold text-gray-600">
          Werkinstructie niet gevonden
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-4 bg-thg-blue hover:bg-thg-blue-light
            text-white font-semibold py-3 px-6 rounded-lg min-h-[44px]
            transition-colors duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar overzicht
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Terug-knop */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-thg-accent hover:text-thg-blue
          font-semibold min-h-[44px] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Terug naar overzicht
      </Link>

      {/* Koptekst */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-thg-accent uppercase tracking-wide">
              {dwi.id}
            </p>
            <h1 className="text-2xl font-bold text-thg-blue-dark mt-1">
              {dwi.titel}
            </h1>
            <span className="inline-block bg-blue-50 text-thg-blue text-sm font-semibold px-3 py-1 rounded-full mt-2">
              {dwi.stationLabel}
            </span>
          </div>
          <StatusBadge status={dwi.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-thg-gray" />
            <div>
              <p className="text-thg-gray">Auteur</p>
              <p className="font-medium">{dwi.auteur}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-thg-gray" />
            <div>
              <p className="text-thg-gray">Datum</p>
              <p className="font-medium">{dwi.datum}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-thg-gray" />
            <div>
              <p className="text-thg-gray">Versie</p>
              <p className="font-medium">v{dwi.versie}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-thg-gray" />
            <div>
              <p className="text-thg-gray">Goedgekeurd door</p>
              <p className="font-medium">{dwi.goedgekeurdDoor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PBM & Gereedschap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-thg-orange" />
            PBM (Veiligheid)
          </h2>
          <ul className="space-y-2">
            {dwi.pbm.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-base"
              >
                <span className="w-2 h-2 bg-thg-orange rounded-full shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
            <Wrench className="w-5 h-5 text-thg-accent" />
            Gereedschap
          </h2>
          <ul className="space-y-2">
            {dwi.gereedschap.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-base"
              >
                <span className="w-2 h-2 bg-thg-accent rounded-full shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stappen */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-thg-blue-dark mb-6">
          Werkstappen
        </h2>
        <div className="space-y-6">
          {dwi.stappen.map((stap) => (
            <div key={stap.nummer} className="flex gap-4">
              <div
                className="shrink-0 w-10 h-10 rounded-full bg-thg-blue text-white
                  flex items-center justify-center font-bold text-base"
              >
                {stap.nummer}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">{stap.titel}</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {stap.beschrijving}
                </p>
                {stap.waarschuwing && (
                  <div className="flex items-start gap-2 bg-orange-50 border-l-4 border-l-thg-orange rounded-lg p-3">
                    <AlertTriangle className="w-5 h-5 text-thg-orange shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-800">
                      {stap.waarschuwing}
                    </p>
                  </div>
                )}
                {stap.tip && (
                  <div className="flex items-start gap-2 bg-green-50 border-l-4 border-l-thg-green rounded-lg p-3">
                    <Lightbulb className="w-5 h-5 text-thg-green shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{stap.tip}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
