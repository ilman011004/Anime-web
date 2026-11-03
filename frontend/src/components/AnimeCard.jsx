
function AnimeCard({ anime, onDetail }) {
  const genreList = (anime.genre || '')
    .split(',')
    .map((genre) => genre.trim())
    .filter(Boolean)

  function bukaDetail() {
    if (onDetail) {
      onDetail(anime)
    }
  }

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#12121c] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/20">
      {/* Poster Anime */}
      <button
        type="button"
        className="block w-full cursor-pointer text-left"
        onClick={bukaDetail}
        aria-label={`Lihat detail ${anime.judul}`}
      >
        <div className="relative aspect-3/4 overflow-hidden bg-[#1c1c2b]">
          {anime.poster_url ? (
            <img
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={anime.poster_url}
              alt={`Poster ${anime.judul}`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
                event.currentTarget.nextElementSibling.style.display = 'flex'
              }}
            />
          ) : null}

          {/* Placeholder jika poster tidak tersedia */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-purple-950 via-[#191629] to-[#101018] p-4 text-center"
            style={{
              display: anime.poster_url ? 'none' : 'flex',
            }}
          >
            <span className="text-xs font-black tracking-[0.3em] text-purple-400">
              ANIMEVERSE
            </span>

            <strong className="line-clamp-3 text-base font-bold text-white sm:text-lg">
              {anime.judul}
            </strong>
          </div>

          {/* Gradasi poster */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/10" />

          {/* Overlay saat poster diarahkan atau difokuskan */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-purple-600/90 text-lg shadow-lg">
              ▶
            </span>

            <span>Lihat Detail</span>
          </div>

          {/* Tahun anime */}
          {anime.tahun && (
            <span className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              {anime.tahun}
            </span>
          )}
        </div>
      </button>

      {/* Informasi Anime */}
      <div className="flex flex-col p-3.5 sm:p-4">
        <button
          type="button"
          className="mb-3 min-h-12 cursor-pointer text-left text-sm font-bold leading-6 text-white transition-colors hover:text-purple-400 sm:text-base"
          onClick={bukaDetail}
          title={anime.judul}
        >
          <span className="line-clamp-2">{anime.judul}</span>
        </button>

        {/* Genre */}
        <div className="mb-4 flex min-h-6 flex-wrap items-center gap-1.5">
          {genreList.length > 0 ? (
            genreList.slice(0, 2).map((genre) => (
              <span
                className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-[10px] font-medium text-purple-300 sm:text-xs"
                key={genre}
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-400 sm:text-xs">
              Anime
            </span>
          )}

          {genreList.length > 2 && (
            <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-400 sm:text-xs">
              +{genreList.length - 2}
            </span>
          )}
        </div>

        {/* Tombol Detail */}
        <button
          type="button"
          className="mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-600/10 px-3 py-2.5 text-xs font-bold text-purple-300 transition-all hover:border-purple-500 hover:bg-purple-600 hover:text-white sm:text-sm"
          onClick={bukaDetail}
        >
          Lihat Sinopsis

          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>
    </article>
  )
}

export default AnimeCard
