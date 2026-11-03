
import { Link } from 'react-router-dom'

function AdminDashboard({
  daftarAnime = [],
  loading = false,
  onImport,
  sedangImpor = false,
}) {
  const totalAnime = daftarAnime.length

  const totalGenre = new Set(
    daftarAnime.flatMap((anime) =>
      (anime.genre || '')
        .split(',')
        .map((genre) => genre.trim())
        .filter(Boolean)
    )
  ).size

  const animeTerbaru = [...daftarAnime]
    .slice(-5)
    .reverse()

  const statistik = [
    {
      judul: 'Total Anime',
      nilai: loading ? '...' : totalAnime,
      deskripsi: 'Anime dalam katalog',
      ikon: '▤',
      warna: 'purple',
    },
    {
      judul: 'Total Genre',
      nilai: loading ? '...' : totalGenre,
      deskripsi: 'Genre yang tersedia',
      ikon: '◇',
      warna: 'blue',
    },
    {
      judul: 'Sumber Katalog',
      nilai: 'AniList',
      deskripsi: 'Sumber metadata anime',
      ikon: '↻',
      warna: 'emerald',
    },
  ]

  const warnaIkon = {
    purple: 'bg-purple-500/10 text-purple-300 ring-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-300 ring-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">
      {/* Sambutan dashboard */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-purple-950/80 via-zinc-900 to-zinc-900 p-5 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-purple-300 sm:text-xs">
              OVERVIEW
            </span>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Dashboard
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Kelola katalog anime dan pantau koleksi AnimeVerse dari satu tempat.
            </p>
          </div>

          <Link
            to="/admin/anime"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 sm:w-auto"
          >
            <span aria-hidden="true">＋</span>
            Kelola Anime
          </Link>
        </div>
      </section>

      {/* Kartu statistik */}
      <section>
        <div className="mb-4">
          <h3 className="text-base font-bold text-white">
            Ringkasan Katalog
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Informasi singkat mengenai koleksi anime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statistik.map((item) => (
            <article
              key={item.judul}
              className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-white/20 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-400">
                    {item.judul}
                  </p>

                  <h3 className="mt-3 wrap-break-word text-3xl font-black tracking-tight text-white">
                    {item.nilai}
                  </h3>
                </div>

                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ring-1 ${warnaIkon[item.warna]}`}
                  aria-hidden="true"
                >
                  {item.ikon}
                </span>
              </div>

              <p className="mt-4 border-t border-white/5 pt-3 text-xs text-zinc-500">
                {item.deskripsi}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Tabel anime terbaru */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">
              Koleksi Anime
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Beberapa anime yang tersedia di katalog.
            </p>
          </div>

          <Link
            to="/admin/anime"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 transition hover:text-purple-200"
          >
            Lihat semua
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center px-5 py-10 text-sm text-zinc-400">
            <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-purple-400/30 border-t-purple-400" />
            Memuat data anime...
          </div>
        ) : animeTerbaru.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-2xl text-zinc-500">
              ▤
            </span>

            <p className="mt-4 font-semibold text-zinc-300">
              Belum ada anime
            </p>

            <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
              Tambahkan anime secara manual atau impor metadata dari AniList.
            </p>

            <Link
              to="/admin/anime"
              className="mt-4 text-sm font-semibold text-purple-300 hover:text-purple-200"
            >
              Mulai kelola anime →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-140 border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 sm:px-6">
                    Anime
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Genre
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Tahun
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {animeTerbaru.map((anime) => (
                  <tr
                    key={anime.id}
                    className="transition hover:bg-white/2.5]"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        {anime.poster_url ? (
                          <img
                            src={anime.poster_url}
                            alt={`Poster ${anime.judul}`}
                            loading="lazy"
                            className="h-14 w-10 shrink-0 rounded-lg border border-white/10 bg-zinc-800 object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-lg font-black text-purple-300">
                            A
                          </div>
                        )}

                        <span className="max-w-xs wrap-break-word text-sm font-semibold text-zinc-200">
                          {anime.judul}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {anime.genre || '-'}
                    </td>

                    <td className="px-5 py-4 text-sm tabular-nums text-zinc-400">
                      {anime.tahun || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && animeTerbaru.length > 0 && (
          <div className="border-t border-white/10 px-5 py-3 text-xs text-zinc-500 sm:px-6">
            Menampilkan maksimal {animeTerbaru.length} anime.
          </div>
        )}
      </section>

      {/* Impor AniList */}
      <section className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300 ring-1 ring-indigo-500/20">
            ↻
          </span>

          <div className="min-w-0">
            <h3 className="font-bold text-white">
              Impor Katalog AniList
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Tambahkan metadata anime populer ke database AnimeVerse.
              Anime yang sudah tercatat akan dilewati sesuai aturan impor backend.
            </p>

            <p className="mt-3 text-xs text-zinc-500">
              Pastikan backend aktif dan kamu sudah login sebagai admin.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onImport}
          disabled={sedangImpor || loading}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-800 px-5 py-3 text-sm font-bold text-white transition hover:border-purple-500/40 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {sedangImpor && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}

          {sedangImpor ? 'Mengimpor...' : 'Impor Anime'}
        </button>
      </section>
    </div>
  )
}

export default AdminDashboard
