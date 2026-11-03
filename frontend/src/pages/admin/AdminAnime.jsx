import { useState } from 'react'

function AdminAnime({
  daftarAnime = [],
  loading = false,
  onTambah,
  onEdit,
  onDelete,
  onDetail,
}) {
  const [pencarian, setPencarian] = useState('')

  const animeDifilter = daftarAnime.filter((anime) =>
    (anime.judul || '')
      .toLowerCase()
      .includes(pencarian.toLowerCase().trim())
  )

  const tombolAksi =
    'inline-flex items-center justify-center rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-purple-500 hover:bg-purple-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40'

  return (
    <div className="w-full space-y-8 text-zinc-100">
      {/* Header halaman */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="text-xs font-bold tracking-[0.2em] text-purple-400">
            CONTENT MANAGEMENT
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Kelola Anime
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Kelola informasi, metadata, dan koleksi anime AnimeVerse.
          </p>
        </div>

        <button
          type="button"
          onClick={onTambah}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:w-auto"
        >
          <span className="text-lg leading-none" aria-hidden="true">
            +
          </span>
          Tambah Anime
        </button>
      </section>

      {/* Panel daftar anime */}
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl shadow-black/10">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Daftar Anime
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              {loading
                ? 'Sedang mengambil data...'
                : `${animeDifilter.length} anime ditemukan`}
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <label htmlFor="pencarian-anime" className="sr-only">
              Cari judul anime
            </label>

            <div className="relative">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                id="pencarian-anime"
                type="search"
                placeholder="Cari judul anime..."
                value={pencarian}
                onChange={(event) => setPencarian(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </div>

        {/* Isi tabel */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500"
              role="status"
              aria-label="Memuat data"
            />
            <p className="text-sm text-zinc-400">
              Memuat data anime...
            </p>
          </div>
        ) : animeDifilter.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-800/70 text-2xl text-zinc-400">
              {pencarian.trim() ? '⌕' : '🎬'}
            </div>

            <h4 className="text-base font-semibold text-white">
              {pencarian.trim()
                ? 'Anime tidak ditemukan'
                : 'Belum ada data anime'}
            </h4>

            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
              {pencarian.trim()
                ? 'Coba gunakan kata kunci judul yang berbeda.'
                : 'Tambahkan anime baru untuk mulai mengisi katalog.'}
            </p>

            {pencarian.trim() && (
              <button
                type="button"
                onClick={() => setPencarian('')}
                className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-purple-400 transition hover:bg-purple-500/10 hover:text-purple-300"
              >
                Hapus pencarian
              </button>
            )}

            {!pencarian.trim() && (
              <button
                type="button"
                onClick={onTambah}
                className="mt-4 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                Tambah Anime
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Anime
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Genre
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Tahun
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80">
                {animeDifilter.map((anime) => (
                  <tr
                    key={anime.id}
                    className="transition hover:bg-zinc-800/40"
                  >
                    {/* Informasi anime */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {anime.poster_url ? (
                          <img
                            src={anime.poster_url}
                            alt={`Poster ${anime.judul}`}
                            loading="lazy"
                            className="h-16 w-12 shrink-0 rounded-lg border border-zinc-700 bg-zinc-800 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-lg font-bold text-purple-400">
                            {(anime.judul || 'A').charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="max-w-xs wrap-break-word text-sm font-semibold text-white">
                            {anime.judul || 'Tanpa judul'}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Koleksi AnimeVerse
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="px-6 py-4">
                      <span className="inline-block max-w-xs rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs leading-5 text-purple-300">
                        {anime.genre || 'Belum dikategorikan'}
                      </span>
                    </td>

                    {/* Tahun */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                      {anime.tahun || '—'}
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={tombolAksi}
                          onClick={() => onDetail?.(anime)}
                          aria-label={`Lihat detail ${anime.judul}`}
                        >
                          Detail
                        </button>

                        <button
                          type="button"
                          className={tombolAksi}
                          onClick={() => onEdit?.(anime)}
                          aria-label={`Edit ${anime.judul}`}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                          onClick={() => onDelete?.(anime.id)}
                          aria-label={`Hapus ${anime.judul}`}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer tabel */}
        {!loading && animeDifilter.length > 0 && (
          <div className="border-t border-zinc-800 px-5 py-4 sm:px-6">
            <p className="text-xs text-zinc-500">
              Menampilkan {animeDifilter.length} dari {daftarAnime.length} anime
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminAnime