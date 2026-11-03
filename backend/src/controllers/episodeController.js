
const { pool } = require('../../db');

// GET: Mengambil daftar episode berdasarkan ID anime
async function getEpisodesByAnimeId(req, res) {
    try {
        const { animeId } = req.params;

        const hasil = await pool.query(
            `SELECT *
             FROM episode
             WHERE anime_id = $1
             ORDER BY nomor_episode ASC`,
            [animeId]
        );

        res.json(hasil.rows);
    } catch (error) {
        console.error('Gagal mengambil episode:', error.message);

        res.status(500).json({
            message: 'Gagal mengambil daftar episode.',
        });
    }
}

// POST: Menambahkan episode ke anime
async function createEpisode(req, res) {
    try {
        const { animeId } = req.params;
        const {
            nomor_episode,
            judul_episode,
            sinopsis,
            video_url,
        } = req.body;

        // Validasi ID anime
        if (!/^\d+$/.test(String(animeId)) || Number(animeId) < 1) {
            return res.status(400).json({
                message: 'ID anime tidak valid.',
            });
        }

        // Pastikan anime tersedia
        const anime = await pool.query(
            'SELECT id FROM anime WHERE id = $1',
            [Number(animeId)]
        );

        if (anime.rows.length === 0) {
            return res.status(404).json({
                message: 'Anime tidak ditemukan.',
            });
        }

        // Validasi nomor episode
        if (
            nomor_episode === undefined ||
            nomor_episode === null ||
            nomor_episode === '' ||
            !Number.isInteger(Number(nomor_episode)) ||
            Number(nomor_episode) < 1
        ) {
            return res.status(400).json({
                message: 'Nomor episode harus berupa bilangan bulat positif.',
            });
        }

        // Validasi judul
        if (
            typeof judul_episode !== 'string' ||
            !judul_episode.trim()
        ) {
            return res.status(400).json({
                message: 'Judul episode wajib diisi.',
            });
        }

        // Validasi sinopsis opsional
        if (
            sinopsis !== undefined &&
            sinopsis !== null &&
            typeof sinopsis !== 'string'
        ) {
            return res.status(400).json({
                message: 'Sinopsis harus berupa teks.',
            });
        }

        // Validasi URL
        if (typeof video_url !== 'string' || !video_url.trim()) {
            return res.status(400).json({
                message: 'URL video wajib diisi.',
            });
        }

        try {
            const url = new URL(video_url.trim());

            if (!['http:', 'https:'].includes(url.protocol)) {
                return res.status(400).json({
                    message: 'URL video harus menggunakan HTTP atau HTTPS.',
                });
            }
        } catch {
            return res.status(400).json({
                message: 'URL video tidak valid.',
            });
        }

        // Simpan episode
        const hasil = await pool.query(
            `INSERT INTO episode
                (anime_id, nomor_episode, judul_episode, sinopsis, video_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                Number(animeId),
                Number(nomor_episode),
                judul_episode.trim(),
                sinopsis?.trim() || null,
                video_url.trim(),
            ]
        );

        res.status(201).json({
            message: 'Episode berhasil ditambahkan.',
            data: hasil.rows[0],
        });
    } catch (error) {
        console.error('Gagal menambahkan episode:', error.message);

        if (error.code === '23505') {
            return res.status(409).json({
                message: 'Nomor episode tersebut sudah digunakan.',
            });
        }

        res.status(500).json({
            message: 'Gagal menambahkan episode.',
        });
    }
}

module.exports = {
    getEpisodesByAnimeId,
    createEpisode,
};
