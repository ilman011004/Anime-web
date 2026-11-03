
function AnimeForm({
  idEdit,
  judul,
  setJudul,
  genre,
  setGenre,
  tahun,
  setTahun,
  sinopsis,
  setSinopsis,
  posterUrl,
  setPosterUrl,
  sedangMenyimpan,
  onSubmit,
  onCancel,
}) {
  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#0b0b12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:opacity-50'

  const labelClass =
    'mb-2 block text-sm font-semibold text-slate-300'

  const sedangEdit = idEdit !== null

  return (
    <section className="rounded-2xl border border-white/10 bg-[#12121c] p-5 sm:p-7">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
          {sedangEdit ? 'Perbarui koleksi' : 'Koleksi anime'}
        </span>

        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
          {sedangEdit ? 'Edit Anime' : 'Tambah Anime'}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {sedangEdit
            ? 'Perbarui informasi anime yang sudah tersimpan.'
            : 'Lengkapi informasi berikut untuk menambahkan anime baru.'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Judul Anime */}
        <div>
          <label className={labelClass} htmlFor="judul-anime">
            Judul Anime <span className="text-purple-400">*</span>
          </label>

          <input
            id="judul-anime"
            type="text"
            className={inputClass}
            placeholder="Contoh: Naruto Shippuden"
            value={judul}
            onChange={(event) => setJudul(event.target.value)}
            required
            disabled={sedangMenyimpan}
          />
        </div>

        {/* Genre */}
        <div>
          <label className={labelClass} htmlFor="genre-anime">
            Genre <span className="text-purple-400">*</span>
          </label>

          <input
            id="genre-anime"
            type="text"
            className={inputClass}
            placeholder="Action, Adventure, Fantasy"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            required
            disabled={sedangMenyimpan}
          />

          <p className="mt-2 text-xs text-slate-500">
            Pisahkan setiap genre menggunakan koma.
          </p>
        </div>

        {/* Tahun Rilis */}
        <div>
          <label className={labelClass} htmlFor="tahun-anime">
            Tahun Rilis <span className="text-purple-400">*</span>
          </label>

          <input
            id="tahun-anime"
            type="number"
            className={inputClass}
            placeholder="Contoh: 2024"
            min="1900"
            max={new Date().getFullYear() + 10}
            value={tahun}
            onChange={(event) => setTahun(event.target.value)}
            required
            disabled={sedangMenyimpan}
          />
        </div>

        {/* URL Poster */}
        <div>
          <label className={labelClass} htmlFor="poster-anime">
            URL Poster <span className="font-normal text-slate-500">(Opsional)</span>
          </label>

          <input
            id="poster-anime"
            type="url"
            className={inputClass}
            placeholder="https://contoh.com/poster.jpg"
            value={posterUrl}
            onChange={(event) => setPosterUrl(event.target.value)}
            disabled={sedangMenyimpan}
          />
        </div>

        {/* Sinopsis */}
        <div>
          <label className={labelClass} htmlFor="sinopsis-anime">
            Sinopsis <span className="font-normal text-slate-500">(Opsional)</span>
          </label>

          <textarea
            id="sinopsis-anime"
            className={`${inputClass} min-h-32 resize-y leading-6`}
            placeholder="Tuliskan sinopsis singkat anime..."
            value={sinopsis}
            onChange={(event) => setSinopsis(event.target.value)}
            rows={4}
            disabled={sedangMenyimpan}
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
          <button
            type="submit"
            disabled={sedangMenyimpan}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sedangMenyimpan ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Menyimpan...
              </>
            ) : sedangEdit ? (
              'Simpan Perubahan'
            ) : (
              '+ Tambah Anime'
            )}
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28"
            onClick={onCancel}
            disabled={sedangMenyimpan}
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  )
}

export default AnimeForm
