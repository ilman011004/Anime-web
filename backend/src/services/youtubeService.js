
const axios = require('axios');

const YOUTUBE_API_URL =
  'https://www.googleapis.com/youtube/v3/search';

async function cariVideoAnime(judulAnime) {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY belum dikonfigurasi.');
  }

  if (!judulAnime || !judulAnime.trim()) {
    throw new Error('Judul anime wajib diisi.');
  }

  const response = await axios.get(YOUTUBE_API_URL, {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      part: 'snippet',
      q: `${judulAnime} official`,
      type: 'video',
      maxResults: 10,
      regionCode: process.env.YOUTUBE_REGION_CODE || 'ID',
      videoEmbeddable: 'true',
      safeSearch: 'strict',
    },
    timeout: 10000,
  });

  return response.data.items.map((item) => ({
    videoId: item.id.videoId,
    judulVideo: item.snippet.title,
    channel: item.snippet.channelTitle,
    tanggalPublikasi: item.snippet.publishedAt,
    videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || null,
  }));
}

module.exports = {
  cariVideoAnime,
};
