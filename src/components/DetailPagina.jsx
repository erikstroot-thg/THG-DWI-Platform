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
  ClipboardList,
  Package,
  Target,
  AlertCircle,
  ListChecks,
} from 'lucide-react'
import { WERKINSTRUCTIES, STATIONS } from '../data/werkinstructies'
import StatusBadge from './StatusBadge'

function getStationLabel(code) {
  const s = STATIONS.find((st) => st.code === code)
  return s ? s.label : code
}

/* Foto grid voor een stap — 80% beeld principe */
function StapFotos({ afbeeldingen, bijschrift }) {
  if (!afbeeldingen || afbeeldingen.length === 0) return null
  const isEnkele = afbeeldingen.length === 1
  const isTwee = afbeeldingen.length === 2
  return (
    <div
      className={
        isEnkele
          ? 'grid grid-cols-1 gap-3 mt-4'
          : isTwee
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4'
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4'
      }
    >
      {afbeeldingen.map((src, i) => (
        <figure key={i} className="m-0 group">
          <div className="overflow-hidden rounded-xl shadow-md bg-gray-100 aspect-video">
            <img
              src={src}
              alt={bijschrift?.[i] || `Foto ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          {bijschrift?.[i] && (
            <figcaption className="text-xs text-gray-500 mt-1.5 text-center leading-snug px-1">
              {bijschrift[i]}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}

/* Render a single step (used in both flat stappen and secties) */
function StapRender({ stap }) {
  const heeftFotos = stap.afbeeldingen && stap.afbeeldingen.length > 0
  return (
    <div className="flex gap-4">
      <div
        className="shrink-0 w-10 h-10 rounded-full bg-thg-blue text-white
          flex items-center justify-center font-bold text-base"
      >
        {stap.nummer}
      </div>
      <div className="flex-1 space-y-3">
        <h3 className="text-lg font-semibold">{stap.titel}</h3>
        <p className="text-base text-gray-700 leading-relaxed">
          {stap.beschrijving}
        </p>

        {/* Foto's — direct na omschrijving voor maximale visuele impact */}
        {heeftFotos && (
          <StapFotos afbeeldingen={stap.afbeeldingen} bijschrift={stap.bijschrift} />
        )}

        {/* Substappen */}
        {stap.substappen && stap.substappen.length > 0 && (
          <ul className="ml-2 space-y-1 mt-3">
            {stap.substappen.map((sub, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-5 h-5 shrink-0 rounded-full bg-blue-100 text-thg-blue flex items-center justify-center text-xs font-semibold mt-0.5">
                  {String.fromCharCode(97 + i)}
                </span>
                {sub}
              </li>
            ))}
          </ul>
        )}

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
  )
}

export default function DetailPagina() {
  const { id } = useParams()
  const dwi = WERKINSTRUCTIES.find((w) => w.id === id)

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

  const heeftSecties = dwi.secties && dwi.secties.length > 0
  const heeftStappen = dwi.stappen && dwi.stappen.length > 0

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
              {dwi.stationNummer} &middot; {getStationLabel(dwi.station)}
            </span>
            {dwi.machine && (
              <p className="text-sm text-thg-gray mt-2">{dwi.machine}</p>
            )}
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
              <p className="font-medium">{dwi.goedgekeurd}</p>
            </div>
          </div>
        </div>

        {dwi.volgendeReview && (
          <p className="text-xs text-thg-gray mt-4">
            Volgende review: {dwi.volgendeReview}
          </p>
        )}
      </div>

      {/* Belangrijke opmerkingen */}
      {dwi.opmerkingenImportant && dwi.opmerkingenImportant.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:p-6">
          <h2 className="text-lg font-semibold text-orange-800 flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-thg-orange" />
            Belangrijke opmerkingen
          </h2>
          <ul className="space-y-2">
            {dwi.opmerkingenImportant.map((opmerking, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-orange-900">
                <AlertTriangle className="w-4 h-4 text-thg-orange shrink-0 mt-1" />
                {opmerking}
              </li>
            ))}
          </ul>
        </div>
      )}

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

      {/* Materialen */}
      {dwi.materialen && dwi.materialen.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-thg-blue" />
            Materialen
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-semibold text-thg-gray">Materiaal</th>
                  {dwi.materialen[0].samenstelling && (
                    <th className="py-2 pr-4 font-semibold text-thg-gray">Samenstelling</th>
                  )}
                  {dwi.materialen[0].variant && (
                    <th className="py-2 pr-4 font-semibold text-thg-gray">Variant</th>
                  )}
                  {dwi.materialen[0].mesje && (
                    <th className="py-2 pr-4 font-semibold text-thg-gray">Mesje</th>
                  )}
                  {dwi.materialen[0].wieltje && (
                    <th className="py-2 font-semibold text-thg-gray">Wieltje</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {dwi.materialen.map((mat, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{mat.naam}</td>
                    {mat.samenstelling !== undefined && <td className="py-2 pr-4">{mat.samenstelling}</td>}
                    {mat.variant !== undefined && <td className="py-2 pr-4">{mat.variant}</td>}
                    {mat.mesje !== undefined && <td className="py-2 pr-4">{mat.mesje}</td>}
                    {mat.wieltje !== undefined && <td className="py-2">{mat.wieltje}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Werkstappen (flat) */}
      {heeftStappen && !heeftSecties && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-xl font-semibold text-thg-blue-dark mb-6">
            Werkstappen
          </h2>
          <div className="space-y-6">
            {dwi.stappen.map((stap) => (
              <StapRender key={stap.nummer} stap={stap} />
            ))}
          </div>
        </div>
      )}

      {/* Secties met stappen (multi-section DWIs) */}
      {heeftSecties && (
        <div className="space-y-6">
          {dwi.secties.map((sectie) => (
            <div
              key={sectie.nummer}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
            >
              <h2 className="text-xl font-semibold text-thg-blue-dark mb-6 flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-thg-accent text-white flex items-center justify-center font-bold text-sm">
                  {sectie.nummer}
                </span>
                {sectie.titel}
              </h2>
              <div className="space-y-6">
                {sectie.stappen.map((stap) => (
                  <StapRender key={`${sectie.nummer}-${stap.nummer}`} stap={stap} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI's */}
      {dwi.kpis && dwi.kpis.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-thg-green" />
            Kwaliteitsindicatoren (KPI)
          </h2>
          <ul className="space-y-2">
            {dwi.kpis.map((kpi, i) => (
              <li key={i} className="flex items-center gap-2 text-base">
                <ListChecks className="w-4 h-4 text-thg-green shrink-0" />
                {kpi}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Afwijkingen */}
      {dwi.afwijkingen && dwi.afwijkingen.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-red-500" />
            Afwijkingen &amp; Storingen
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-4 font-semibold text-thg-gray">Afwijking</th>
                  <th className="py-2 pr-4 font-semibold text-thg-gray">Oorzaak</th>
                  <th className="py-2 font-semibold text-thg-gray">Actie</th>
                </tr>
              </thead>
              <tbody>
                {dwi.afwijkingen.map((a, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-red-700">{a.afwijking}</td>
                    <td className="py-3 pr-4 text-gray-600">{a.oorzaak}</td>
                    <td className="py-3 text-thg-blue-dark font-medium">{a.actie}</td>
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
