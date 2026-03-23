import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WERKINSTRUCTIES } from '../data/werkinstructies'
import { getGeneratedDwis, updateDwiStatus, deleteDwi } from '../utils/dwiService'
import DwiCard from './DwiCard'
import StationFilter from './StationFilter'
import ZoekBalk from './ZoekBalk'
import PincodeModal from './PincodeModal'
import { SearchX, Sparkles } from 'lucide-react'

export default function OverzichtPagina() {
  const [zoekterm, setZoekterm] = useState('')
  const [station, setStation] = useState('alle')
  const [generatedDwis, setGeneratedDwis] = useState([])
  const [pinModal, setPinModal] = useState({ open: false, dwi: null })
  const [laden, setLaden] = useState(false)

  const laadDwis = () => {
    getGeneratedDwis().then(setGeneratedDwis).catch(() => {})
  }

  useEffect(() => {
    laadDwis()
  }, [])

  const alleDwis = useMemo(() => {
    // Merge hardcoded + generated, avoid duplicates by id
    const ids = new Set(WERKINSTRUCTIES.map(d => d.id))
    const extra = generatedDwis.filter(d => !ids.has(d.id))
    return [...WERKINSTRUCTIES, ...extra]
  }, [generatedDwis])

  const gefilterd = useMemo(() => {
    return alleDwis.filter((dwi) => {
      const matchStation = station === 'alle' || dwi.station === station
      if (!matchStation) return false
      if (!zoekterm) return true
      const tekst =
        `${dwi.zoektermen || ''} ${dwi.titel} ${dwi.machine} ${dwi.id}`.toLowerCase()
      return tekst.includes(zoekterm.toLowerCase())
    })
  }, [zoekterm, station, alleDwis])

  const handleGoedkeuren = (dwi) => {
    setPinModal({ open: true, dwi })
  }

  const handlePinSubmit = async (pin) => {
    if (!pinModal.dwi) return
    setLaden(true)
    try {
      await updateDwiStatus(pinModal.dwi.id, 'goedgekeurd', pin)
      setPinModal({ open: false, dwi: null })
      laadDwis() // Refresh list
    } catch (err) {
      throw err // Let modal show the error
    } finally {
      setLaden(false)
    }
  }

  const handleAfkeuren = async (dwi) => {
    const bevestig = window.confirm(
      `Weet je zeker dat je "${dwi.titel}" (${dwi.id}) wilt verwijderen?\n\nDit kan niet ongedaan worden gemaakt.`
    )
    if (!bevestig) return

    try {
      await deleteDwi(dwi.id)
      laadDwis() // Refresh list
    } catch (err) {
      alert(`Verwijderen mislukt: ${err.message}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <ZoekBalk waarde={zoekterm} onChange={setZoekterm} />
      <StationFilter actief={station} onFilter={setStation} />

      {/* Nieuwe DWI kaart */}
      <Link
        to="/nieuw"
        className="block bg-gradient-to-r from-thg-blue to-thg-accent rounded-xl p-5
          text-white hover:shadow-lg transition-all hover:scale-[1.005] group"
      >
        <div className="flex items-center gap-4">
          <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <div>
            <p className="text-lg font-bold">Nieuwe DWI aanmaken met AI</p>
            <p className="text-sm text-blue-100">
              Upload foto's en beschrijf het proces — Claude genereert de werkinstructie
            </p>
          </div>
        </div>
      </Link>

      {gefilterd.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {gefilterd.map((dwi) => (
            <DwiCard
              key={dwi.id}
              dwi={dwi}
              onGoedkeuren={handleGoedkeuren}
              onAfkeuren={handleAfkeuren}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-thg-gray">
          <SearchX className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-gray-600">
            Geen werkinstructies gevonden
          </h3>
          <p className="mt-2 text-sm">
            Pas je zoekopdracht of stationfilter aan.
          </p>
        </div>
      )}

      {/* Pincode Modal */}
      <PincodeModal
        open={pinModal.open}
        onClose={() => setPinModal({ open: false, dwi: null })}
        onSubmit={handlePinSubmit}
        laden={laden}
      />
    </div>
  )
}
