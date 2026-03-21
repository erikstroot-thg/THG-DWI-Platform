import { useState, useMemo } from 'react'
import { werkinstructies } from '../data/werkinstructies'
import DwiCard from './DwiCard'
import StationFilter from './StationFilter'
import ZoekBalk from './ZoekBalk'
import { SearchX } from 'lucide-react'

export default function OverzichtPagina() {
  const [zoekterm, setZoekterm] = useState('')
  const [station, setStation] = useState('alle')

  const gefilterd = useMemo(() => {
    return werkinstructies.filter((dwi) => {
      const matchStation = station === 'alle' || dwi.station === station
      if (!matchStation) return false
      if (!zoekterm) return true
      const tekst =
        `${dwi.zoektermen} ${dwi.titel} ${dwi.machine} ${dwi.samenvatting}`.toLowerCase()
      return tekst.includes(zoekterm.toLowerCase())
    })
  }, [zoekterm, station])

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <ZoekBalk waarde={zoekterm} onChange={setZoekterm} />
      <StationFilter actief={station} onFilter={setStation} />

      {gefilterd.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {gefilterd.map((dwi) => (
            <DwiCard key={dwi.id} dwi={dwi} />
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
    </div>
  )
}
