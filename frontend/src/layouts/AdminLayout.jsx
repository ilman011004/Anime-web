import { NavLink, Link, useNavigate } from 'react-router-dom'

function AdminLayout({ children }) {
  const navigate = useNavigate()

  function handleLogout() {
    const konfirmasi = window.confirm(
      'Apakah kamu yakin ingin keluar dari akun admin?'
    )

    if (!konfirmasi) return

    localStorage.removeItem('animeverse_admin_token')
    localStorage.removeItem('animeverse_admin')

    navigate('/admin/login', { replace: true })
  }

  const menuClass = ({ isActive }) =>
    [
      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
      isActive
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/30'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
    ].join(' ')

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 lg:flex">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-zinc-900 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        {/* Brand */}
        <Link
          to="/admin"
          className="flex items-center gap-3 border-b border-white/10 px-5 py-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-xl font-black text-white shadow-lg shadow-purple-950/40">
            A
          </span>

          <span className="min-w-0">
            <span className="block whitespace-nowrap text-base font-black tracking-wide text-white">
              ANIME<span className="text-purple-400">VERSE</span>
            </span>

            <span className="mt-1 block text-[10px] font-bold tracking-[0.2em] text-zinc-500">
              ADMIN PANEL
            </span>
          </span>
        </Link>

        {/* Navigasi */}
        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-zinc-500">
            MENU UTAMA
          </p>

          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            <NavLink to="/admin" end className={menuClass}>
              <span className="text-lg" aria-hidden="true">▦</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/anime" className={menuClass}>
              <span className="text-lg" aria-hidden="true">▤</span>
              <span>Kelola Anime</span>
            </NavLink>

            <NavLink to="/admin/episodes" className={menuClass}>
              <span className="text-lg" aria-hidden="true">▶</span>
              <span>Kelola Episode</span>
            </NavLink>
          </nav>
        </div>

        {/* Bagian bawah sidebar */}
        <div className="mt-auto border-t border-white/10 p-4">
          <Link
            to="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <span aria-hidden="true">↗</span>
            Lihat Website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <span aria-hidden="true">⇥</span>
            Logout Admin
          </button>
        </div>
      </aside>

      {/* Area utama */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.2em] text-purple-400 sm:text-xs">
                MANAGEMENT SYSTEM
              </p>

              <h1 className="mt-1 truncate text-lg font-bold text-white sm:text-xl">
                Panel Administrasi
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="hidden text-xs font-semibold text-emerald-300 sm:inline">
                Area Admin
              </span>
              <span className="text-xs font-semibold text-emerald-300 sm:hidden">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Konten halaman */}
        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 px-4 py-5 text-center text-xs text-zinc-600 sm:px-6">
          © {new Date().getFullYear()} AnimeVerse Admin Panel
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout
