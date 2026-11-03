
function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <label className="relative block w-full">
        {/* Ikon pencarian */}
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <input
          type="search"
          className="w-full rounded-2xl border border-white/10 bg-[#12121c] py-4 pl-12 pr-12 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/20 focus:border-purple-500 focus:bg-[#151522] focus:ring-4 focus:ring-purple-500/10"
          placeholder="Cari judul anime..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Cari anime berdasarkan judul"
        />

        {/* Petunjuk keyboard pada layar besar */}
        {!value && (
          <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-500 sm:block">
            Cari anime
          </span>
        )}
      </label>
    </div>
  )
}

export default SearchBar
