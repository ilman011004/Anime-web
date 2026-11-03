
import { useEffect, useState } from 'react'
import {
  getEpisodesByAnimeId,
  createEpisode,
} from '../../services/episodeService'

function AdminEpisodes({ daftarAnime = [] }) {
  const [animeId, setAnimeId] = useState('')
  const [daftarEpisode, setDaftarEpisode] = useState([])
  const [nomorEpisode, setNomorEpisode] = useState('')
  const [judulEpisode, setJudulEpisode] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [menyimpan, setMenyimpan] = useState(false)

  // Mengambil episode berdasarkan anime yang dipilih
  async function ambilEpisode(id) {
    if (!id) {
      setDaftarEpisode([])
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const data = await getEpisodesByAnimeId(id)
      setDaftarEpisode(Array.isArray(data) ? data : [])
    } catch (error) {
      setDaftarEpisode([])
      alert(error.message || 'Gagal mengambil episode.')
    } finally {
      setLoading(false)
    }
  }

  // Memuat ulang episode saat pilihan anime berubah
  useEffect(() => {
    ambilEpisode(animeId)
  }, [animeId])

  // Menambahkan episode baru
  async function handleSubmit(event) {
    event.preventDefault()

    if (!animeId) {
      alert('Silakan pilih anime terlebih dahulu.')
      return
    }

    if (!nomorEpisode || !judulEpisode.trim() || !videoUrl.trim()) {
      alert('Nomor episode, judul, dan URL video wajib diisi.')
      return
    }

    const nomor = Number(nomorEpisode)

    if (!Number.isInteger(nomor) || nomor < 1) {
      alert('Nomor episode harus berupa bilangan bulat minimal 1.')
      return
    }

    try {
      const url = new URL(videoUrl.trim())

      if (!['http:', 'https:'].includes(url.protocol)) {
        alert('URL video harus menggunakan HTTP atau HTTPS.')
        return
      }
    } catch {
      alert('URL video tidak valid.')
      return
    }

    setMenyimpan(true)

    try {
      await createEpisode(animeId, {
        nomor_episode: nomor,
        judul_episode: judulEpisode.trim(),
        sinopsis: sinopsis.trim(),
        video_url: videoUrl.trim(),
      })

      // Kosongkan form setelah berhasil
      setNomorEpisode('')
      setJudulEpisode('')
      setSinopsis('')
      setVideoUrl('')

      // Muat ulang daftar episode
      await ambilEpisode(animeId)

      alert('Episode berhasil ditambahkan.')
    } catch (error) {
      alert(error.message || 'Gagal menambahkan episode.')
    } finally {
      setMenyimpan(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:opacity-50'

  const labelClass = 'block text-sm font-semibold text-zinc-300'

  return (
    <div className="min-w-0 space-y-6 text-zinc-100">
      {/* Header halaman */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#19152b] via-[#12121c] to-[#0b0b12] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
              Content Management
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Kelola Episode
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Tambahkan dan kelola daftar episode berdasarkan anime yang
            tersedia di katalog AnimeVerse.
          </p>
        </div>
      </section>

      {/* Pilih anime */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-white">Pilih Anime</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Pilih anime untuk melihat episode yang sudah tersedia.
          </p>
        </div>

        <label htmlFor="pilih-anime" className={labelClass}>
          Anime
        </label>

        <select
          id="pilih-anime"
          value={animeId}
          onChange={(event) => setAnimeId(event.target.value)}
          className={inputClass}
        >
          <option value="">Pilih anime...</option>

          {daftarAnime.map((anime) => (
            <option key={anime.id} value={anime.id}>
              {anime.judul}
            </option>
          ))}
        </select>

        {!daftarAnime.length && (
          <p className="mt-3 text-sm text-amber-300">
            Belum ada data anime. Tambahkan anime terlebih dahulu.
          </p>
        )}
      </section>

      {/* Form tambah episode */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Tambah Episode</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Isi informasi episode yang ingin ditambahkan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nomor-episode" className={labelClass}>
                Nomor episode
              </label>

              <input
                id="nomor-episode"
                type="number"
                min="1"
                step="1"
                value={nomorEpisode}
                onChange={(event) => setNomorEpisode(event.target.value)}
                placeholder="Contoh: 1"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="judul-episode" className={labelClass}>
                Judul episode
              </label>

              <input
                id="judul-episode"
                type="text"
                value={judulEpisode}
                onChange={(event) => setJudulEpisode(event.target.value)}
                placeholder="Masukkan judul episode"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Sinopsis episode */}
          <div>
            <label htmlFor="sinopsis-episode" className={labelClass}>
              Sinopsis episode (opsional)
            </label>

            <textarea
              id="sinopsis-episode"
              value={sinopsis}
              onChange={(event) => setSinopsis(event.target.value)}
              placeholder="Ceritakan secara singkat isi episode..."
              rows={4}
              className={inputClass}
            />
          </div>

          {/* URL video */}
          <div>
            <label htmlFor="url-video" className={labelClass}>
              URL video
            </label>

            <input
              id="url-video"
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://example.com/video"
              required
              className={inputClass}
            />

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Masukkan URL video langsung atau URL embed resmi yang
              diizinkan untuk ditampilkan di website.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
              Pastikan anime sudah dipilih sebelum menyimpan.
            </p>

            <button
              type="submit"
              disabled={!animeId || menyimpan}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {menyimpan ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <span aria-hidden="true">+</span>
                  Simpan Episode
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Daftar episode */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70">
        <div className="flex flex-col gap-2 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-white">Daftar Episode</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Episode yang terdaftar untuk anime pilihan.
            </p>
          </div>

          {animeId && !loading && (
            <span className="w-fit rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
              {daftarEpisode.length} episode
            </span>
          )}
        </div>

        {!animeId ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-2xl">
              <span aria-hidden="true">▤</span>
            </div>

            <p className="font-semibold text-zinc-300">
              Pilih anime terlebih dahulu
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Daftar episode akan ditampilkan setelah anime dipilih.
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-12 text-sm text-zinc-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />
            Memuat episode...
          </div>
        ) : daftarEpisode.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <p className="font-semibold text-zinc-300">
              Belum ada episode
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Tambahkan episode pertama untuk anime ini melalui form di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-zinc-950/40">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Episode
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Judul
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Sinopsis
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Video
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {daftarEpisode.map((episode) => (
                  <tr
                    key={episode.id}
                    className="transition hover:bg-white/3"
                  >
                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-sm font-bold text-purple-300">
                        {episode.nomor_episode}
                      </span>
                    </td>

                    <td className="max-w-xs px-5 py-4 text-sm font-medium text-zinc-200">
                      {episode.judul_episode}
                    </td>

                    <td className="max-w-sm px-5 py-4 text-sm leading-6 text-zinc-400">
                      {episode.sinopsis || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <a
                        href={episode.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 transition hover:text-purple-300"
                      >
                        Buka URL
                        <span aria-hidden="true">↗</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminEpisodes
