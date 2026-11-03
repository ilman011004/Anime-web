
const { pool } = require('../../db');
const { validasiAnime } = require('../validators/animeValidator');
const { imporAnimeDariAniList } = require('../services/aniListService');

// GET: Mengambil semua anime
async function getAllAnime(req, res) {
    try {
        const hasil = await pool.query(
            'SELECT * FROM anime ORDER BY id ASC'
        );

        res.json(hasil.rows);
    } catch (error) {
        console.error('Gagal mengambil daftar anime:', error.message);
        res.status(500).json({
            message: 'Gagal mengambil daftar anime.',
        });
    }
}

// GET: Mengambil detail anime berdasarkan ID
async function getAnimeById(req, res) {
    try {
        const { id } = req.params;

        const hasil = await pool.query(
            'SELECT * FROM anime WHERE id = $1',
            [id]
        );

        if (hasil.rows.length === 0) {
            return res.status(404).json({
                message: 'Anime tidak ditemukan.',
            });
        }

        res.json(hasil.rows[0]);
    } catch (error) {
        console.error('Gagal mengambil detail anime:', error.message);
        res.status(500).json({
            message: 'Gagal mengambil detail anime.',
        });
    }
}

// POST: Menambahkan anime
async function createAnime(req, res) {
    try {
        const errorValidasi = validasiAnime(req.body);

        if (errorValidasi) {
            return res.status(400).json({
                message: errorValidasi,
            });
        }

        const { judul, genre, tahun, sinopsis, poster_url } = req.body;

        const hasil = await pool.query(
            `INSERT INTO anime
                (judul, genre, tahun, sinopsis, poster_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                judul.trim(),
                genre.trim(),
                Number(tahun),
                sinopsis || null,
                poster_url || null,
            ]
        );

        res.status(201).json({
            message: 'Anime berhasil ditambahkan.',
            data: hasil.rows[0],
        });
    } catch (error) {
        console.error('Gagal menambahkan anime:', error.message);
        res.status(500).json({
            message: 'Gagal menambahkan anime.',
        });
    }
}

// PUT: Mengubah data anime
async function updateAnime(req, res) {
    try {
        const errorValidasi = validasiAnime(req.body);

        if (errorValidasi) {
            return res.status(400).json({
                message: errorValidasi,
            });
        }

        const { id } = req.params;
        const { judul, genre, tahun, sinopsis, poster_url } = req.body;

        const hasil = await pool.query(
            `UPDATE anime
             SET judul = $1,
                 genre = $2,
                 tahun = $3,
                 sinopsis = $4,
                 poster_url = $5
             WHERE id = $6
             RETURNING *`,
            [
                judul.trim(),
                genre.trim(),
                Number(tahun),
                sinopsis || null,
                poster_url || null,
                id,
            ]
        );

        if (hasil.rows.length === 0) {
            return res.status(404).json({
                message: 'Anime tidak ditemukan.',
            });
        }

        res.json({
            message: 'Anime berhasil diperbarui.',
            data: hasil.rows[0],
        });
    } catch (error) {
        console.error('Gagal mengubah anime:', error.message);
        res.status(500).json({
            message: 'Gagal mengubah anime.',
        });
    }
}

// DELETE: Menghapus anime
async function deleteAnime(req, res) {
    try {
        const { id } = req.params;

        const hasil = await pool.query(
            'DELETE FROM anime WHERE id = $1 RETURNING *',
            [id]
        );

        if (hasil.rows.length === 0) {
            return res.status(404).json({
                message: 'Anime tidak ditemukan.',
            });
        }

        res.json({
            message: 'Anime berhasil dihapus.',
            data: hasil.rows[0],
        });
    } catch (error) {
        console.error('Gagal menghapus anime:', error.message);
        res.status(500).json({
            message: 'Gagal menghapus anime.',
        });
    }
}

// POST: Mengimpor katalog anime dari AniList
async function importAnime(req, res) {
    try {
        const hasil = await imporAnimeDariAniList();
        res.json(hasil);
    } catch (error) {
        console.error('Gagal mengimpor anime:', error.message);
        res.status(500).json({
            message: 'Gagal mengimpor katalog anime.',
            error: error.message,
        });
    }
}

module.exports = {
    getAllAnime,
    getAnimeById,
    createAnime,
    updateAnime,
    deleteAnime,
    importAnime,
};
