import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../services/api'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sedangLogin, setSedangLogin] = useState(false)
  const [pesanError, setPesanError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    setPesanError('')
    setSedangLogin(true)

    try {
      const hasil = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      if (!hasil.token) {
        throw new Error('Token login tidak ditemukan.')
      }

      // Simpan token JWT admin
      localStorage.setItem(
        'animeverse_admin_token',
        hasil.token
      )

      // Simpan informasi admin untuk tampilan frontend
      if (hasil.admin) {
        localStorage.setItem(
          'animeverse_admin',
          JSON.stringify(hasil.admin)
        )
      }

      // Masuk ke dashboard setelah login berhasil
      navigate('/admin', { replace: true })
    } catch (error) {
      console.error('Login admin gagal:', error)

      setPesanError(
        error.message || 'Login gagal. Silakan coba kembali.'
      )
    } finally {
      setSedangLogin(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-zinc-100">
      {/* Dekorasi latar belakang */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-700/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

      {/* Kartu login */}
      <form
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9"
        onSubmit={handleSubmit}
      >
        {/* Logo */}
        <Link
          to="/"
          className="mb-9 inline-flex items-center gap-3"
          aria-label="AnimeVerse, kembali ke halaman utama"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-xl font-black text-white shadow-lg shadow-purple-950/40">
            A
          </span>

          <span className="text-lg font-black tracking-wide text-white">
            ANIME<span className="text-purple-400">VERSE</span>
          </span>
        </Link>

        {/* Judul */}
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold tracking-[0.2em] text-purple-300">
            ADMINISTRATION
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Selamat datang
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Masuk ke akun admin untuk mengelola katalog anime AnimeVerse.
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="admin-email"
            className="mb-2 block text-sm font-semibold text-zinc-200"
          >
            Email admin
          </label>

          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@animeverse.com"
            required
            disabled={sedangLogin}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:opacity-60"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label
            htmlFor="admin-password"
            className="mb-2 block text-sm font-semibold text-zinc-200"
          >
            Password
          </label>

          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password"
            required
            disabled={sedangLogin}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:opacity-60"
          />
        </div>

        {/* Pesan error */}
        {pesanError && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
          >
            {pesanError}
          </div>
        )}

        {/* Tombol login */}
        <button
          type="submit"
          disabled={sedangLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sedangLogin ? 'Sedang masuk...' : 'Masuk ke Dashboard'}

          {!sedangLogin && (
            <span aria-hidden="true">→</span>
          )}
        </button>

        {/* Kembali ke website */}
        <div className="mt-7 border-t border-white/10 pt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-purple-300"
          >
            <span aria-hidden="true">←</span>
            Kembali ke website
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          AnimeVerse Admin Panel
        </p>
      </form>
    </main>
  )
}

export default AdminLogin
