
import { useEffect, useState } from 'react';
import VideoAnime from "./VideoAnime";

const HOST_EMBED_DIIZINKAN = new Set([
  'www.youtube-nocookie.com',
  'www.youtube.com',
  'youtube.com',
  'player.vimeo.com',
]);

function tentukanJenisVideo(videoUrl) {
  if (!videoUrl) return 'none';

  try {
    const url = new URL(videoUrl);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'invalid';
    }

    const host = url.hostname.toLowerCase();

    if (
      HOST_EMBED_DIIZINKAN.has(host) &&
      (
        url.pathname.startsWith('/embed/') ||
        url.pathname.startsWith('/video/')
      )
    ) {
      return 'embed';
    }

    if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
      return 'direct';
    }

    return 'unsupported';
  } catch {
    return 'invalid';
  }
}

function AnimeDetail({
  anime,
  daftarEpisode = [],
  loadingDetail,
  onKembali,
}) {
  const [episodeDiputar, setEpisodeDiputar] = useState(null);
  const [errorVideo, setErrorVideo] = useState('');

  function putarEpisode(episode) {
    setEpisodeDiputar(episode);
    setErrorVideo('');

    window.setTimeout(() => {
      document
        .getElementById('pemutar-episode')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 0);
  }

  function tutupPemutar() {
    setEpisodeDiputar(null);
    setErrorVideo('');
  }

  useEffect(() => {
    if (
      episodeDiputar &&
      !daftarEpisode.some(
        (episode) => episode.id === episodeDiputar.id
      )
    ) {
      setEpisodeDiputar(null);
      setErrorVideo('');
    }
  }, [daftarEpisode, episodeDiputar]);

  const tombolSekunder =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10';

  const jenisVideo = tentukanJenisVideo(
    episodeDiputar?.video_url
  );

  return (
    <section className="space-y-8">
      <button
        type="button"
        className={tombolSekunder}
        onClick={onKembali}
      >
        <span aria-hidden="true">←</span>
        Kembali ke Katalog
      </button>

      {loadingDetail ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#12121c]">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500"
            role="status"
            aria-label="Memuat detail anime"
          />
          <p className="text-sm text-slate-400">
            Memuat detail anime...
          </p>
        </div>
      ) : !anime ? (
        <div className="rounded-2xl border border-white/10 bg-[#12121c] p-8 text-center">
          <h2 className="text-xl font-bold text-white">
            Anime tidak ditemukan
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Data anime tidak tersedia atau gagal dimuat.
          </p>

          <button
            type="button"
            className={`${tombolSekunder} mt-5`}
            onClick={onKembali}
          >
            Kembali ke Katalog
          </button>
        </div>
      ) : (
        <>
          {/* Informasi anime */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12121c]">
            <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
              {/* Poster */}
              <div className="relative mx-auto w-full max-w-xs p-5 md:max-w-none md:p-0">
                {anime.poster_url ? (
                  <img
                    src={anime.poster_url}
                    alt={`Poster ${anime.judul}`}
                    className="aspect-3/4 w-full rounded-2xl object-cover shadow-xl md:h-full md:rounded-none"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex aspect-3/4 w-full flex-col items-center justify-center gap-4 rounded-2xl bg-linear-to-br from-purple-950 via-[#191629] to-[#101018] p-5 text-center md:h-full md:rounded-none">
                    <span className="text-xs font-black tracking-[0.3em] text-purple-400">
                      ANIMEVERSE
                    </span>

                    <h3 className="text-xl font-bold text-white">
                      {anime.judul}
                    </h3>

                    <span className="text-sm text-slate-400">
                      Poster belum tersedia
                    </span>
                  </div>
                )}
              </div>

              {/* Informasi detail */}
              <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                <span className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                  Anime Details
                </span>

                <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {anime.judul}
                </h1>

                <div className="mt-5 flex flex-wrap gap-2">
                  {anime.tahun && (
                    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300">
                      {anime.tahun}
                    </span>
                  )}

                  {anime.genre &&
                    anime.genre
                      .split(',')
                      .map((genre) => genre.trim())
                      .filter(Boolean)
                      .map((genre) => (
                        <span
                          key={genre}
                          className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-purple-300"
                        >
                          {genre}
                        </span>
                      ))}
                </div>

                <div className="mt-8">
                  <h2 className="mb-3 text-lg font-bold text-white">
                    Sinopsis
                  </h2>

                  <p className="whitespace-pre-line text-sm leading-7 text-slate-400 sm:text-base">
                    {anime.sinopsis ||
                      'Belum ada sinopsis untuk anime ini.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video YouTube otomatis dari API */}
          <VideoAnime judulAnime={anime.judul} />

          {/* Pemutar episode dari database */}
          {episodeDiputar && (
            <section
              id="pemutar-episode"
              className="scroll-mt-6 rounded-2xl border border-purple-500/20 bg-[#12121c] p-5 sm:p-7"
            >
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
                    Now Playing
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                    Episode {episodeDiputar.nomor_episode}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {episodeDiputar.judul_episode}
                  </p>
                </div>

                <button
                  type="button"
                  className={tombolSekunder}
                  onClick={tutupPemutar}
                >
                  Tutup Pemutar
                </button>
              </div>

              {episodeDiputar.sinopsis && (
                <p className="mb-5 whitespace-pre-line text-sm leading-6 text-slate-400">
                  {episodeDiputar.sinopsis}
                </p>
              )}

              {jenisVideo === 'direct' && (
                <video
                  key={episodeDiputar.id}
                  controls
                  playsInline
                  preload="metadata"
                  className="mx-auto block max-h-[75vh] w-full rounded-xl bg-black"
                  onError={() => {
                    setErrorVideo(
                      'Video gagal dimuat. Periksa URL, format video, dan izin akses.'
                    );
                  }}
                >
                  <source src={episodeDiputar.video_url} />
                  Browser kamu tidak mendukung pemutar video.
                </video>
              )}

              {jenisVideo === 'embed' && (
                <div className="aspect-video overflow-hidden rounded-xl bg-black">
                  <iframe
                    key={episodeDiputar.id}
                    src={episodeDiputar.video_url}
                    title={`Episode ${episodeDiputar.nomor_episode}: ${episodeDiputar.judul_episode}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              )}

              {jenisVideo === 'unsupported' && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <h3 className="font-bold text-amber-200">
                    Format tautan belum didukung
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Gunakan URL embed dari penyedia yang diizinkan
                    atau URL video langsung yang diperbolehkan.
                  </p>
                </div>
              )}

              {(jenisVideo === 'invalid' ||
                jenisVideo === 'none') && (
                <p className="rounded-xl bg-white/5 p-4 text-sm text-slate-400">
                  URL video tidak valid atau belum tersedia.
                </p>
              )}

              {errorVideo && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm leading-6 text-red-300"
                >
                  {errorVideo}
                </p>
              )}
            </section>
          )}

          {/* Daftar episode PostgreSQL */}
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
                  Watch Episodes
                </span>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Daftar Episode
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Pilih episode yang ingin kamu tonton.
                </p>
              </div>

              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300">
                {daftarEpisode.length} episode
              </span>
            </div>

            {daftarEpisode.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {daftarEpisode.map((episode) => {
                  const sedangDiputar =
                    episodeDiputar?.id === episode.id;

                  return (
                    <article
                      className={`flex flex-col rounded-2xl border bg-[#12121c] p-5 transition-all duration-200 ${
                        sedangDiputar
                          ? 'border-purple-500/60 shadow-lg shadow-purple-950/20'
                          : 'border-white/10 hover:border-purple-500/30'
                      }`}
                      key={episode.id}
                    >
                      <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-black text-purple-300">
                          {String(episode.nomor_episode).padStart(2, '0')}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold leading-6 text-white">
                            Episode {episode.nomor_episode}
                          </h3>

                          <p className="mt-1 wrap-break-word text-sm text-slate-400">
                            {episode.judul_episode}
                          </p>
                        </div>
                      </div>

                      {episode.sinopsis && (
                        <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-500">
                          {episode.sinopsis}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => putarEpisode(episode)}
                        disabled={!episode.video_url}
                        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-slate-500"
                      >
                        <span aria-hidden="true">
                          {sedangDiputar ? '▶' : '▷'}
                        </span>

                        {sedangDiputar
                          ? 'Sedang Diputar'
                          : episode.video_url
                            ? 'Putar Episode'
                            : 'Video Belum Tersedia'}
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#12121c] px-5 py-12 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-2xl text-purple-400">
                  ▷
                </span>

                <h3 className="text-lg font-bold text-white">
                  Belum Ada Episode
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Episode dari database belum tersedia. Kamu tetap
                  bisa melihat video terkait anime pada bagian Video
                  Anime di atas.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default AnimeDetail;
