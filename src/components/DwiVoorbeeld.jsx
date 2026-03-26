import {
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Lightbulb,
  ClipboardList,
  AlertCircle,
} from 'lucide-react'
import { STATIONS } from '../data/werkinstructies'
import StatusBadge from './StatusBadge'

function getStationLabel(code) {
  const s = STATIONS.find((st) => st.code === code)
  return s ? s.label : code
}

function StapPreview({ stap }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-thg-blue text-white flex items-center justify-center font-bold text-base">
        {stap.nummer}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold">{stap.titel}</h3>
        <p className="text-base text-gray-700 leading-relaxed">{stap.beschrijving}</p>

        {stap.afbeeldingen && stap.afbeeldingen.length > 0 && (
          <div className={`grid gap-3 my-3 ${stap.afbeeldingen.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {stap.afbeeldingen.map((src, i) => (
              <figure key={i} className="m-0">
                <div className="bg-gray-100 rounded-lg p-4 text-center border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">
                    {stap.bijschrift?.[i] || `Foto ${i + 1}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{src}</p>
                </div>
              </figure>
            ))}
          </div>
        )}

        {stap.substappen && stap.substappen.length > 0 && (
          <ul className="ml-2 space-y-1">
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
            <p className="text-sm text-orange-800">{stap.waarschuwing}</p>
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

export default function DwiVoorbeeld({ dwi }) {
  if (!dwi) return null

  const heeftSecties = dwi.secties && dwi.secties.length > 0
  const heeftStappen = dwi.stappen && dwi.stappen.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-thg-accent uppercase tracking-wide">{dwi.id}</p>
            <h1 className="text-2xl font-bold text-thg-blue-dark mt-1">{dwi.titel}</h1>
            <span className="inline-block bg-blue-50 text-thg-blue text-sm font-semibold px-3 py-1 rounded-full mt-2">
              {dwi.stationNummer} &middot; {getStationLabel(dwi.station)}
            </span>
            {dwi.machine && <p className="text-sm text-thg-gray mt-2">{dwi.machine}</p>}
          </div>
          <StatusBadge status={dwi.status} />
        </div>
      </div>

      {/* Important notes */}
      {dwi.opmerkingenImportant && dwi.opmerkingenImportant.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:p-6">
          <h2 className="text-lg font-semibold text-orange-800 flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-thg-orange" />
            Belangrijke opmerkingen
          </h2>
          <ul className="space-y-2">
            {dwi.opmerkingenImportant.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-orange-900">
                <AlertTriangle className="w-4 h-4 text-thg-orange shrink-0 mt-1" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PBM + Gereedschap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dwi.pbm && dwi.pbm.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-thg-orange" />
              PBM (Veiligheid)
            </h2>
            <ul className="space-y-2">
              {dwi.pbm.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-base">
                  <span className="w-2 h-2 bg-thg-orange rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {dwi.gereedschap && dwi.gereedschap.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-thg-accent" />
              Gereedschap
            </h2>
            <ul className="space-y-2">
              {dwi.gereedschap.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-base">
                  <span className="w-2 h-2 bg-thg-accent rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Flat stappen */}
      {heeftStappen && !heeftSecties && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-xl font-semibold text-thg-blue-dark mb-6">Werkstappen</h2>
          <div className="space-y-6">
            {dwi.stappen.map((stap) => (
              <StapPreview key={stap.nummer} stap={stap} />
            ))}
          </div>
        </div>
      )}

      {/* Secties */}
      {heeftSecties && (
        <div className="space-y-6">
          {dwi.secties.map((sectie) => (
            <div key={sectie.nummer} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-xl font-semibold text-thg-blue-dark mb-6 flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-thg-accent text-white flex items-center justify-center font-bold text-sm">
                  {sectie.nummer}
                </span>
                {sectie.titel}
              </h2>
              <div className="space-y-6">
                {sectie.stappen.map((stap) => (
                  <StapPreview key={`${sectie.nummer}-${stap.nummer}`} stap={stap} />
                ))}
              </div>
            </div>
          ))}
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
