
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/youtube/search';

export default function VideoAnime({ judulAnime }) {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!judulAnime?.trim()) {
      setVideos([]);
      setSelectedVideo(null);
      return;
    }

    const controller = new AbortController();

    async function fetchVideos() {
      setLoading(true);
      setError('');
      setVideos([]);
      setSelectedVideo(null);

      try {
        const params = new URLSearchParams({
          judul: judulAnime.trim(),
        });

        const response = await fetch(
          `${API_URL}?${params.toString()}`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || 'Gagal mengambil video.'
          );
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setVideos(data);
        setSelectedVideo(data[0] || null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal memuat video.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchVideos();

    return () => controller.abort();
  }, [judulAnime]);

  return (
    <section className="mt-10 space-y-6 text-white">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Video Anime
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Video terkait {judulAnime}
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-xl bg-gray-900 p-5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-red-500" />
          <p className="text-sm text-gray-300">
            Sedang mencari video...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center">
          <p className="font-medium">Video belum tersedia</p>
          <p className="mt-2 text-sm text-gray-400">
            Belum ada video yang ditemukan untuk anime ini.
          </p>
        </div>
      )}

      {!loading && !error && selectedVideo && (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
            <div className="relative aspect-video bg-black">
              <iframe
                key={selectedVideo.videoId}
                src={selectedVideo.videoUrl}
                title={selectedVideo.judulVideo}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Video pilihan
              </span>

              <h3 className="mt-2 text-lg font-semibold leading-snug sm:text-xl">
                {selectedVideo.judulVideo}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {selectedVideo.channel}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">
                Video lainnya
              </h3>
              <span className="text-sm text-gray-400">
                {videos.length} video
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => {
                const active =
                  selectedVideo.videoId === video.videoId;

                return (
                  <button
                    type="button"
                    key={video.videoId}
                    onClick={() => setSelectedVideo(video)}
                    aria-pressed={active}
                    className={`group overflow-hidden rounded-xl border text-left transition ${
                      active
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-800">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.judulVideo}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-lg text-white shadow-lg">
                          ▶
                        </span>
                      </span>
                    </div>

                    <div className="space-y-2 p-3">
                      <p className="line-clamp-2 text-sm font-semibold leading-5">
                        {video.judulVideo}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {video.channel}
                      </p>

                      {active && (
                        <span className="inline-block text-xs font-medium text-red-400">
                          Sedang dipilih
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
