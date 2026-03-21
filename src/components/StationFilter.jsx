import { stations } from '../data/werkinstructies'

export default function StationFilter({ actief, onFilter }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stations.map((s) => {
        const isActive = actief === s.code
        return (
          <button
            key={s.code}
            onClick={() => onFilter(s.code)}
            className={`py-2 px-4 rounded-full text-sm font-semibold min-h-[44px]
              border-2 transition-colors duration-150
              ${
                isActive
                  ? 'bg-thg-blue text-white border-thg-blue'
                  : 'bg-white text-thg-blue border-gray-200 hover:bg-thg-blue hover:text-white hover:border-thg-blue active:bg-thg-blue active:text-white'
              }`}
          >
            {s.nummer ? `${s.nummer} \u00b7 ${s.label}` : s.label}
          </button>
        )
      })}
    </div>
  )
}
