import { Search } from 'lucide-react'

export default function ZoekBalk({ waarde, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-thg-gray" />
      <input
        type="text"
        value={waarde}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Zoek werkinstructie... (bijv. boormachine, hardoven, snijlijn)"
        className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-base
          focus:outline-none focus:ring-2 focus:ring-thg-accent focus:border-thg-accent
          placeholder:text-gray-400 min-h-[44px]"
      />
    </div>
  )
}
