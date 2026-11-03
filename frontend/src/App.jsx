import { useState, useEffect, useCallback } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom'

import './index.css'

import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import AnimeForm from './components/AnimeForm'
import AnimeDetail from './components/AnimeDetail'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminAnime from './pages/admin/AdminAnime'
import AdminEpisodes from './pages/admin/AdminEpisodes'

import {
  getAllAnime,
  getAnimeById,
  createAnime,
  updateAnime,
  deleteAnime,
} from './services/animeService'

import { getEpisodesByAnimeId } from './services/episodeService'
import { apiRequest } from './services/api'

// Mengubah judul menjadi slug untuk URL yang lebih mudah dibaca.
// Contoh: "Demon Slayer: Kimetsu no Yaiba" menjadi "demon-slayer-kimetsu-no-yaiba".
function buatSlug(judul = '') {
  return judul
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Pemeriksaan awal di frontend.
// Middleware backend tetap menjadi pengaman utama API.
function RequireAdmin({ children }) {
  const token = localStorage.getItem('animeverse_admin_token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

// Halaman detail khusus jalur admin.
// Bisa dibuka langsung melalui URL atau melalui tombol Detail.
function AdminAnimeDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [anime, setAnime] = useState(null)
  const [daftarEpisode, setDaftarEpisode] = useState([])
  const [loadingDetail, setLoadingDetail] = useState(true)
  const [pesanError, setPesanError] = useState('')

  useEffect(() => {
    let dibatalkan = false

    async function muatDetail() {
      setLoadingDetail(true)
      setPesanError('')
      setAnime(null)
      setDaftarEpisode([])

      try {
        const semuaAnime = await getAllAnime()

        const animeDitemukan = Array.isArray(semuaAnime)
          ? semuaAnime.find(
              (item) => buatSlug(item.judul) === slug
            )
          : null

        if (!animeDitemukan) {
          throw new Error('Anime tidak ditemukan di katalog.')
        }

        const [dataAnime, dataEpisode] = await Promise.all([
          getAnimeById(animeDitemukan.id),
          getEpisodesByAnimeId(animeDitemukan.id),
        ])

        if (dibatalkan) return

        setAnime(dataAnime)
        setDaftarEpisode(
          Array.isArray(dataEpisode) ? dataEpisode : []
        )
      } catch (error) {
        if (!dibatalkan) {
          console.error('Gagal memuat detail anime admin:', error)
          setPesanError(
            error.message || 'Gagal memuat detail anime.'
          )
        }
      } finally {
        if (!dibatalkan) {
          setLoadingDetail(false)
        }
      }
    }

    muatDetail()

    return () => {
      dibatalkan = true
    }
  }, [slug])

  function kembaliKeKelolaAnime() {
    navigate('/admin/anime')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loadingDetail) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500"
          role="status"
          aria-label="Memuat detail anime"
        />
        <p className="text-sm text-zinc-400">
          Memuat detail anime...
        </p>
      </div>
    )
  }

  if (pesanError || !anime) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
        <p className="text-xs font-bold tracking-[0.2em] text-purple-400">
          CONTENT MANAGEMENT
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Detail Anime
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {pesanError || 'Data anime tidak tersedia.'}
        </p>

        <button
          type="button"
          onClick={kembaliKeKelolaAnime}
          className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          Kembali ke Kelola Anime
        </button>
      </section>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-purple-400">
            CONTENT MANAGEMENT
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Detail Anime
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Informasi anime dan daftar episode yang tersedia.
          </p>
        </div>

        <button
          type="button"
          onClick={kembaliKeKelolaAnime}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-purple-500 hover:bg-purple-500/10 hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Kembali ke Kelola Anime
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-6">
        <AnimeDetail
          anime={anime}
          daftarEpisode={daftarEpisode}
          loadingDetail={false}
          onKembali={kembaliKeKelolaAnime}
        />
      </div>
    </div>
  )
}

function AppContent() {
  const navigate = useNavigate()

  const [daftarAnime, setDaftarAnime] = useState([])
  const [daftarEpisode, setDaftarEpisode] = useState([])
  const [animeTerpilih, setAnimeTerpilih] = useState(null)

  const [judul, setJudul] = useState('')
  const [genre, setGenre] = useState('')
  const [tahun, setTahun] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [posterUrl, setPosterUrl] = useState('')

  const [idEdit, setIdEdit] = useState(null)
  const [formTerbuka, setFormTerbuka] = useState(false)

  const [loading, setLoading] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false)
  const [sedangImpor, setSedangImpor] = useState(false)

  const [pesanError, setPesanError] = useState('')

  const ambilAnime = useCallback(async () => {
    setLoading(true)
    setPesanError('')

    try {
      const data = await getAllAnime()
      setDaftarAnime(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gagal mengambil anime:', error)
      setPesanError(error.message || 'Gagal mengambil data anime.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    ambilAnime()
  }, [ambilAnime])

  function resetForm() {
    setJudul('')
    setGenre('')
    setTahun('')
    setSinopsis('')
    setPosterUrl('')
    setIdEdit(null)
    setFormTerbuka(false)
  }

  function bukaFormTambah() {
    resetForm()
    setFormTerbuka(true)
    navigate('/admin/anime')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function simpanAnime(event) {
    event.preventDefault()

    if (!judul.trim() || !genre.trim() || !tahun) {
      alert('Judul, genre, dan tahun wajib diisi.')
      return
    }

    const dataAnime = {
      judul: judul.trim(),
      genre: genre.trim(),
      tahun: Number(tahun),
      sinopsis: sinopsis.trim(),
      poster_url: posterUrl.trim(),
    }

    const sedangEdit = idEdit !== null

    setSedangMenyimpan(true)

    try {
      if (sedangEdit) {
        await updateAnime(idEdit, dataAnime)
      } else {
        await createAnime(dataAnime)
      }

      await ambilAnime()
      resetForm()
      navigate('/admin/anime')

      alert(
        sedangEdit
          ? 'Anime berhasil diperbarui.'
          : 'Anime berhasil ditambahkan.'
      )
    } catch (error) {
      console.error('Gagal menyimpan anime:', error)
      alert(error.message || 'Gagal menyimpan anime.')
    } finally {
      setSedangMenyimpan(false)
    }
  }

  function mulaiEdit(anime) {
    setIdEdit(anime.id)
    setJudul(anime.judul || '')
    setGenre(anime.genre || '')
    setTahun(String(anime.tahun || ''))
    setSinopsis(anime.sinopsis || '')
    setPosterUrl(anime.poster_url || '')
    setAnimeTerpilih(null)
    setDaftarEpisode([])
    setFormTerbuka(true)

    navigate('/admin/anime')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function hapusAnime(id) {
    const konfirmasi = window.confirm(
      'Yakin ingin menghapus anime ini?'
    )

    if (!konfirmasi) return

    try {
      await deleteAnime(id)

      if (idEdit === id) {
        resetForm()
      }

      if (animeTerpilih?.id === id) {
        setAnimeTerpilih(null)
        setDaftarEpisode([])
      }

      await ambilAnime()
      alert('Anime berhasil dihapus.')
    } catch (error) {
      console.error('Gagal menghapus anime:', error)
      alert(error.message || 'Gagal menghapus anime.')
    }
  }

  // Detail dari website publik tetap menggunakan rute publik.
  async function bukaDetailPublik(anime) {
    setAnimeTerpilih(anime)
    setDaftarEpisode([])
    setFormTerbuka(false)
    setLoadingDetail(true)

    navigate(`/anime/${anime.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const [dataAnime, dataEpisode] = await Promise.all([
        getAnimeById(anime.id),
        getEpisodesByAnimeId(anime.id),
      ])

      setAnimeTerpilih(dataAnime)
      setDaftarEpisode(
        Array.isArray(dataEpisode) ? dataEpisode : []
      )
    } catch (error) {
      console.error('Gagal memuat detail anime:', error)
      alert(error.message || 'Gagal memuat detail anime.')
    } finally {
      setLoadingDetail(false)
    }
  }

  // Detail dari panel admin menggunakan slug judul anime.
  function bukaDetailAdmin(anime) {
    setFormTerbuka(false)

    const slug = buatSlug(anime.judul)

    if (!slug) {
      alert('Judul anime belum tersedia untuk membuat alamat detail.')
      return
    }

    navigate(`/admin/anime/${slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function kembaliKeKatalog() {
    setAnimeTerpilih(null)
    setDaftarEpisode([])
    setLoadingDetail(false)
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function imporAnime() {
    const konfirmasi = window.confirm(
      'Impor metadata anime populer dari AniList?'
    )

    if (!konfirmasi) return

    setSedangImpor(true)

    try {
      // Menggunakan apiRequest agar token admin ikut dikirim.
      const hasil = await apiRequest('/anime/import/anilist', {
        method: 'POST',
      })

      await ambilAnime()

      alert(
        `${hasil.message || 'Impor selesai.'}\n` +
        `Berhasil ditambahkan: ${hasil.berhasilDitambahkan ?? 0}\n` +
        `Dilewati: ${hasil.dilewati ?? 0}`
      )
    } catch (error) {
      console.error('Gagal impor AniList:', error)
      alert(error.message || 'Gagal mengimpor katalog anime.')
    } finally {
      setSedangImpor(false)
    }
  }

  const propsHome = {
    daftarAnime,
    loading,
    onDetail: bukaDetailPublik,
  }

  const propsAdminAnime = {
    daftarAnime,
    loading,
    onTambah: bukaFormTambah,
    onEdit: mulaiEdit,
    onDelete: hapusAnime,
    onDetail: bukaDetailAdmin,
  }

  return (
    <Routes>
      {/* Halaman publik */}
      <Route
        path="/"
        element={
          <UserLayout>
            <Home {...propsHome} />
          </UserLayout>
        }
      />

      {/* Detail anime publik */}
      <Route
        path="/anime/:id"
        element={
          <UserLayout>
            {animeTerpilih ? (
              <AnimeDetail
                anime={animeTerpilih}
                daftarEpisode={daftarEpisode}
                loadingDetail={loadingDetail}
                onKembali={kembaliKeKatalog}
              />
            ) : (
              <section className="flex min-h-64 flex-col items-center justify-center gap-2 px-6 text-center text-slate-300">
                <h2 className="text-xl font-bold text-white">
                  Memuat detail anime...
                </h2>
                <p>Silakan tunggu sebentar.</p>
              </section>
            )}
          </UserLayout>
        }
      />

      {/* Login admin */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Dashboard admin */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminDashboard
                daftarAnime={daftarAnime}
                loading={loading}
                onImport={imporAnime}
                sedangImpor={sedangImpor}
              />
            </AdminLayout>
          </RequireAdmin>
        }
      />

      {/* Daftar dan form manajemen anime */}
      <Route
        path="/admin/anime"
        element={
          <RequireAdmin>
            <AdminLayout>
              {formTerbuka && (
                <AnimeForm
                  idEdit={idEdit}
                  judul={judul}
                  setJudul={setJudul}
                  genre={genre}
                  setGenre={setGenre}
                  tahun={tahun}
                  setTahun={setTahun}
                  sinopsis={sinopsis}
                  setSinopsis={setSinopsis}
                  posterUrl={posterUrl}
                  setPosterUrl={setPosterUrl}
                  sedangMenyimpan={sedangMenyimpan}
                  onSubmit={simpanAnime}
                  onCancel={resetForm}
                />
              )}

              {pesanError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                >
                  {pesanError}
                </div>
              )}

              <AdminAnime {...propsAdminAnime} />
            </AdminLayout>
          </RequireAdmin>
        }
      />

      {/* Detail anime dalam panel admin */}
      <Route
        path="/admin/anime/:slug"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminAnimeDetailPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />

      {/* Manajemen episode */}
      <Route
        path="/admin/episodes"
        element={
          <RequireAdmin>
            <AdminLayout>
              <AdminEpisodes daftarAnime={daftarAnime} />
            </AdminLayout>
          </RequireAdmin>
        }
      />

      {/* Halaman tidak ditemukan */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App