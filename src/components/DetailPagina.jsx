import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  ZoomIn,
  Pencil,
  QrCode,
  FileDown,
  Languages,
  Loader2,
} from 'lucide-react'
import { WERKINSTRUCTIES, STATIONS } from '../data/werkinstructies'
import { getGeneratedDwis, trackView, openPdfExport, translateDwi } from '../utils/dwiService'
import StatusBadge from './StatusBadge'
import Lightbox from './Lightbox'
import QrCodeModal from './QrCodeModal'

function getStationLabel(code) {
  const s = STATIONS.find((st) => st.code === code)
  return s ? s.label : code
}

/* ─── Photo-first step renderer ─── */
function StapRender({ stap, onImageClick }) {
  const heeftFotos = stap.afbeeldingen && stap.afbeeldingen.length > 0

  return (
    <div className="space-y-3">
      {/* Step header: number + title + short description */}
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-10 h-10 rounded-full bg-thg-blue text-white
            flex items-center justify-center font-bold text-base"
        >
          {stap.nummer}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-tight">{stap.titel}</h3>
          <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
            {stap.beschrijving}
          </p>
        </div>
      </div>

      {/* PHOTOS — the main content (80% visual) */}
      {heeftFotos && (
        <div
          className={`grid gap-2 ${
            stap.afbeeldingen.length === 1
              ? 'grid-cols-1'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {stap.afbeeldingen.map((src, i) => (
            <figure
              key={i}
              className="m-0 cursor-pointer group relative overflow-hidden rounded-lg"
              onClick={() => onImageClick(stap.afbeeldingen, stap.bijschrift, i)}
            >
              <img
                src={src}
                alt={stap.bijschrift?.[i] || `Stap ${stap.nummer} foto ${i + 1}`}
                className="w-full rounded-lg shadow-sm object-cover transition-transform
                  duration-200 group-hover:scale-[1.02]"
                loading="lazy"
              />
              {/* Zoom hint overlay */}
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/10
                  transition-colors duration-200 flex items-center justify-center"
              >
                <ZoomIn
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-80
                    transition-opacity duration-200 drop-shadow-lg"
                />
              </div>
              {stap.bijschrift?.[i] && (
                <figcaption className="text-xs text-gray-500 mt-1.5 text-center italic px-1">
                  {stap.bijschrift[i]}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {/* Substappen — compact below photos */}
      {stap.substappen && stap.substappen.length > 0 && (
        <ul className="ml-1 space-y-1">
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

      {/* Warning & tip — compact */}
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
  )
}

export default function DetailPagina() {
  const { id } = useParams()
  const [generatedDwis, setGeneratedDwis] = useState([])
  const [lightbox, setLightbox] = useState(null) // { images, captions, index }
  const [showQr, setShowQr] = useState(false)
  const [translating, setTranslating] = useState(null) // 'en' | 'ro' | null

  useEffect(() => {
    getGeneratedDwis().then(setGeneratedDwis).catch(() => {})
  }, [])

  const dwi = WERKINSTRUCTIES.find((w) => w.id === id)
    || generatedDwis.find((w) => w.id === id)

  // Track view
  useEffect(() => {
    if (dwi) trackView(dwi.id, dwi.station)
  }, [dwi?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleTranslate(taal) {
    setTranslating(taal)
    try {
      const result = await translateDwi(dwi.id, taal)
      window.open(`/dwi/${result.id}`, '_blank')
    } catch (err) {
      alert(`Vertaling mislukt: ${err.message}`)
    } finally {
      setTranslating(null)
    }
  }

  const openLightbox = (images, captions, index) => {
    setLightbox({ images, captions, index })
  }

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
      {/* QR Code modal */}
      <QrCodeModal
        open={showQr}
        onClose={() => setShowQr(false)}
        dwiId={dwi.id}
        dwiTitel={dwi.titel}
      />

      {/* Lightbox overlay */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          captions={lightbox.captions}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Terug-knop + Bewerken */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-thg-accent hover:text-thg-blue
            font-semibold min-h-[44px] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar overzicht
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowQr(true)}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50
              text-gray-700 font-medium py-2 px-3 rounded-lg min-h-[44px] transition-colors text-sm"
            title="QR-code genereren"
          >
            <QrCode className="w-4 h-4" />
            QR
          </button>
          <button
            onClick={() => openPdfExport(dwi.id)}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50
              text-gray-700 font-medium py-2 px-3 rounded-lg min-h-[44px] transition-colors text-sm"
            title="PDF exporteren"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
          <div className="relative group">
            <button
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50
                text-gray-700 font-medium py-2 px-3 rounded-lg min-h-[44px] transition-colors text-sm"
              title="Vertalen"
            >
              {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              Vertaal
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[140px]">
              <button
                onClick={() => handleTranslate('en')}
                disabled={!!translating}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 rounded-t-lg"
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => handleTranslate('ro')}
                disabled={!!translating}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 rounded-b-lg"
              >
                🇷🇴 Română
              </button>
            </div>
          </div>
          <Link
            to={`/dwi/${id}/bewerken`}
            className="inline-flex items-center gap-2 bg-thg-accent hover:bg-thg-blue
              text-white font-semibold py-2 px-4 rounded-lg min-h-[44px] transition-colors text-sm"
          >
            <Pencil className="w-4 h-4" />
            Bewerken
          </Link>
        </div>
      </div>

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

      {/* PBM & Gereedschap — compact row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-thg-blue-dark flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-thg-orange" />
            PBM (Veiligheid)
          </h2>
          <ul className="space-y-2">
            {dwi.pbm.map((item) => (
              <li key={item} className="flex items-center gap-2 text-base">
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
              <li key={item} className="flex items-center gap-2 text-base">
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

      {/* Werkstappen (flat) — photo-first layout */}
      {heeftStappen && !heeftSecties && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-xl font-semibold text-thg-blue-dark mb-6">
            Werkstappen
          </h2>
          <div className="space-y-8">
            {dwi.stappen.map((stap) => (
              <StapRender key={stap.nummer} stap={stap} onImageClick={openLightbox} />
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
              <div className="space-y-8">
                {sectie.stappen.map((stap) => (
                  <StapRender key={`${sectie.nummer}-${stap.nummer}`} stap={stap} onImageClick={openLightbox} />
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
