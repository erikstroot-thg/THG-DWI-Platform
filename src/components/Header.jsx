import { Link, useLocation } from 'react-router-dom'
import { FileText, Home } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="bg-thg-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 min-h-[44px]">
          <FileText className="w-7 h-7" />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Digitale Werkinstructies
            </h1>
            <p className="text-sm opacity-80">
              Timmermans Hardglas B.V.
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-2 bg-thg-blue-light hover:bg-thg-blue-dark
                text-white font-semibold py-2 px-4 rounded-lg min-h-[44px]
                transition-colors duration-150"
            >
              <Home className="w-5 h-5" />
              <span className="hidden md:inline">Overzicht</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
