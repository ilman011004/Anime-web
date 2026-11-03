const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {
    getEpisodesByAnimeId,
    createEpisode,
} = require('../controllers/episodeController');

// PUBLIC: melihat semua episode dari anime tertentu
router.get('/:animeId/episodes', getEpisodesByAnimeId);

// ADMIN: menambahkan episode ke anime tertentu
router.post('/:animeId/episodes', authMiddleware, createEpisode);

module.exports = router;
