
function Header() {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#19152b] via-[#12121c] to-[#0b0b12] px-5 py-8 sm:px-8 sm:py-10">
      {/* Dekorasi gradasi */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl" />

      <div className="relative">
        {/* Label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
            AnimeVerse Collection
          </span>
        </div>

        {/* Judul */}
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Anime<span className="text-purple-400">List</span>
        </h1>

        {/* Deskripsi */}
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
          Temukan anime favoritmu dan kelola koleksi anime dengan mudah.
        </p>
      </div>
    </header>
  )
}

export default Header
