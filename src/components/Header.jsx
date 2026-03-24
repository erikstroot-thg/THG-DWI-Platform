import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Settings, Star, Target } from 'lucide-react'

function ThgLogo({ className = 'w-10 h-10' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 64"
      role="img"
      aria-label="Timmermans Hardglas logo"
      className={className}
    >
      {/* Glass pane shape — light blue */}
      <path d="M2 2h36v36H2z" fill="#D5E8F0" rx="2" />
      {/* T letter — primary blue */}
      <path d="M8 8h24v6H23v22h-6V14H8z" fill="#005A9C" />
      {/* H letter — dark blue */}
      <path d="M44 8h6v14h12V8h6v36h-6V28H50v16h-6z" fill="#004678" />
      {/* G letter — primary blue */}
      <path d="M74 8h22v6H80v8h14v6H80v10h16v6H74z" fill="#005A9C" />
      {/* Accent bar — orange */}
      <rect x="2" y="46" width="110" height="4" rx="2" fill="#E8750A" />
      {/* Subtitle */}
      <text x="2" y="60" fontSize="8" fontFamily="Calibri, sans-serif" fill="#595959" fontWeight="600">
        TIMMERMANS HARDGLAS
      </text>
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
          <ThgLogo className="w-24 h-14" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-tight">
              Digitale Werkinstructies
            </h1>
            <p className="text-sm opacity-80">
              Timmermans Hardglas B.V.
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-1.5 md:gap-2">
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20
                text-white font-medium py-2 px-3 md:px-4 rounded-lg min-h-[44px]
                transition-colors duration-150 text-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Overzicht</span>
            </Link>
          )}
          <Link
            to="/5s"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20
              text-white font-medium py-2 px-3 md:px-4 rounded-lg min-h-[44px]
              transition-colors duration-150 text-sm"
            title="5S Audit"
          >
            <Star className="w-4 h-4" />
            <span className="hidden lg:inline">5S</span>
          </Link>
          <Link
            to="/ist-soll-gap"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20
              text-white font-medium py-2 px-3 md:px-4 rounded-lg min-h-[44px]
              transition-colors duration-150 text-sm"
            title="IST/SOLL/GAP Analyse"
          >
            <Target className="w-4 h-4" />
            <span className="hidden lg:inline">IST/SOLL</span>
          </Link>
          <Link
            to="/beheer"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20
              text-white font-medium py-2 px-3 md:px-4 rounded-lg min-h-[44px]
              transition-colors duration-150 text-sm"
            title="Beheer"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden lg:inline">Beheer</span>
          </Link>
          <Link
            to="/nieuw"
            className="flex items-center gap-2 bg-thg-green hover:bg-green-600
              text-white font-semibold py-2 px-3 md:px-4 rounded-lg min-h-[44px]
              transition-colors duration-150 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Nieuwe DWI</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
