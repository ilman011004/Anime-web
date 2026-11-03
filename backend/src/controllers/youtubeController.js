
const { cariVideoAnime } = require('../services/youtubeService');

async function cariVideo(req, res) {
  try {
    const { judul } = req.query;

    if (!judul || !judul.trim()) {
      return res.status(400).json({
        message: 'Parameter judul wajib diisi.',
      });
    }

    const videos = await cariVideoAnime(judul.trim());

    return res.json({
      message: 'Pencarian video berhasil.',
      data: videos,
    });
  } catch (error) {
    console.error(
      'Gagal mencari video YouTube:',
      error.response?.data?.error?.message || error.message
    );

    if (error.response?.status === 403) {
      return res.status(502).json({
        message:
          'YouTube API menolak permintaan. Periksa API key, kuota, dan konfigurasi API.',
      });
    }

    return res.status(502).json({
      message: 'Gagal mengambil video dari YouTube API.',
    });
  }
}

module.exports = { cariVideo };
