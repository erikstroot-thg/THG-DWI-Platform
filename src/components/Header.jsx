import { Link, useLocation } from 'react-router-dom'
import { Home, Plus } from 'lucide-react'

function ThgLogo({ className = 'w-10 h-10' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Timmermans Hardglas logo"
      className={className}
    >
      <path d="M0 0h20v20H0zM0 20h20v16c0 8 6 14 14 14h10v14H26C11.6 64 0 52.4 0 38V20z" fill="#AECAE0" />
      <rect x="20" y="20" width="12" height="12" fill="#F13C55" />
      <rect x="20" y="50" width="24" height="14" fill="#2E4E90" />
    </svg>
  )
}

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="bg-thg-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 min-h-[44px]">
          <ThgLogo className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Digitale Werkinstructies
            </h1>
            <p className="text-sm opacity-80">
              Timmermans Hardglas B.V.
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
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
          <Link
            to="/nieuw"
            className="flex items-center gap-2 bg-thg-green hover:bg-green-600
              text-white font-semibold py-2 px-4 rounded-lg min-h-[44px]
              transition-colors duration-150"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Nieuwe DWI</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
