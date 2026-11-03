
import { Link, NavLink } from 'react-router-dom'

function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b12] font-sans text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="AnimeVerse - Beranda"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-xl font-black text-white shadow-lg shadow-purple-950/40">
              A
            </span>

            <span className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
              ANIME
              <span className="text-purple-400">VERSE</span>
            </span>
          </Link>

          {/* Navigasi */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-slate-400 hover:text-white'
                }`
              }
            >
              Beranda
            </NavLink>

            <a
              href="/#katalog"
              className="text-sm font-semibold text-slate-400 transition-colors hover:text-white"
            >
              Katalog Anime
            </a>
          </nav>

          {/* Tombol admin */}
          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm font-bold text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-500/20 hover:text-white"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Konten halaman */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#09090f]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link
              to="/"
              className="text-lg font-extrabold tracking-tight text-white"
            >
              ANIME
              <span className="text-purple-400">VERSE</span>
            </Link>

            <p className="text-sm text-slate-400">
              Jelajahi dunia anime, temukan cerita favoritmu.
            </p>
          </div>

          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} AnimeVerse. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}

export default UserLayout
