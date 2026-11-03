
import { useMemo, useState } from 'react'
import AnimeCard from '../components/AnimeCard'
import SearchBar from '../components/SearchBar'

function Home({ daftarAnime = [], loading, onDetail }) {
  const [pencarian, setPencarian] = useState('')

  const animeDifilter = useMemo(() => {
    const kataKunci = pencarian.toLowerCase().trim()

    return daftarAnime.filter((anime) =>
      (anime.judul || '').toLowerCase().includes(kataKunci)
    )
  }, [daftarAnime, pencarian])

  const animeUnggulan = daftarAnime.find((anime) => anime.poster_url)

  return (
    <div className="space-y-16">
      {/* Hero banner */}
      <section className="relative isolate flex min-h-105 items-center overflow-hidden rounded-3xl border border-white/10 bg-[#15111f] sm:min-h-120 lg:min-h-130">
        {animeUnggulan?.poster_url && (
          <img
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-40"
            src={animeUnggulan.poster_url}
            alt=""
          />
        )}

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#0b0b12] via-[#0b0b12]/90 to-purple-950/30" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#0b0b12]/70 via-transparent to-transparent" />

        <div className="max-w-3xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-purple-300">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            ANIMEVERSE COLLECTION
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
            Temukan dunia
            <br />
            <span className="bg-linear-to-r from-purple-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              anime favoritmu.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            Jelajahi berbagai judul anime, kenali ceritanya,
            dan temukan episode yang ingin kamu tonton.
          </p>

          <a
            href="#katalog"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-950/40 transition-all hover:-translate-y-0.5 hover:bg-purple-500 hover:shadow-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#0b0b12]"
          >
            Jelajahi Katalog
            <span aria-hidden="true" className="text-lg">
              ↓
            </span>
          </a>
        </div>

        <div
          className="pointer-events-none absolute bottom-5 right-6 hidden select-none text-5xl font-black tracking-widest text-white/4 md:block lg:text-7xl"
          aria-hidden="true"
        >
          ANIMEVERSE
        </div>

        <div
          className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl"
          aria-hidden="true"
        />
      </section>

      {/* Katalog anime */}
      <section id="katalog" className="scroll-mt-28">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-purple-400">
              EXPLORE COLLECTION
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Katalog Anime
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Temukan cerita berikutnya untuk menemani waktumu.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
            {loading ? 'Memuat...' : `${animeDifilter.length} judul`}
          </span>
        </div>

        {/* Pencarian */}
        <div className="mb-8 max-w-xl">
          <SearchBar value={pencarian} onChange={setPencarian} />
        </div>

        {/* Status loading dan hasil pencarian */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-5 rounded-2xl border border-white/10 bg-white/2 px-4 text-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400/20 border-t-purple-400"
              role="status"
              aria-label="Memuat katalog"
            />
            <p className="text-sm text-slate-400">
              Memuat katalog anime...
            </p>
          </div>
        ) : animeDifilter.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {animeDifilter.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onDetail={onDetail}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/2 px-5 py-12 text-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-4xl text-purple-300"
              aria-hidden="true"
            >
              ◇
            </span>

            <h3 className="mt-5 text-xl font-bold text-white">
              Anime tidak ditemukan
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Coba gunakan kata kunci judul yang berbeda.
            </p>

            {pencarian && (
              <button
                type="button"
                className="mt-6 rounded-xl border border-purple-400/30 bg-purple-500/10 px-5 py-2.5 text-sm font-semibold text-purple-300 transition-colors hover:bg-purple-500/20 hover:text-white"
                onClick={() => setPencarian('')}
              >
                Hapus pencarian
              </button>
            )}
          </div>
        )}
      </section>

      {/* Penutup halaman */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-400/15 bg-linear-to-br from-purple-950/50 via-[#15111f] to-[#10101a] px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div
          className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-2xl">
          <span className="text-xs font-bold tracking-[0.2em] text-purple-400">
            YOUR NEXT STORY
          </span>

          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            Selalu ada cerita baru untuk ditemukan.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Jelajahi koleksi dan temukan anime favoritmu berikutnya.
          </p>

          <a
            href="#katalog"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-purple-300 transition-colors hover:text-white"
          >
            Lihat katalog anime
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
