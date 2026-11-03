
const express = require('express');
const router = express.Router();

// Middleware autentikasi admin
const authMiddleware = require('../middlewares/authMiddleware');

// Controller anime
const {
    getAllAnime,
    getAnimeById,
    createAnime,
    updateAnime,
    deleteAnime,
    importAnime,
} = require('../controllers/animeController');

// PUBLIC: melihat katalog anime
router.get('/', getAllAnime);

// ADMIN: mengimpor katalog dari AniList
// Letakkan sebelum route /:id agar urutan route lebih jelas
router.post('/import/anilist', authMiddleware, importAnime);

// ADMIN: menambahkan anime
router.post('/', authMiddleware, createAnime);

// PUBLIC: melihat detail anime
router.get('/:id', getAnimeById);

// ADMIN: mengubah anime
router.put('/:id', authMiddleware, updateAnime);

// ADMIN: menghapus anime
router.delete('/:id', authMiddleware, deleteAnime);

module.exports = router;
