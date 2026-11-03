
const express = require('express');
const cors = require('cors');

const animeRoutes = require('./routes/animeRoutes');
const episodeRoutes = require('./routes/episodeRoutes');
const authRoutes = require('./routes/authRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Halaman utama backend
app.get('/', (req, res) => {
    res.send('Backend Anime Streaming berjalan!');
});

// Route autentikasi admin
// POST /api/auth/login
app.use('/api/auth', authRoutes);

// Route API anime
app.use('/api/anime', animeRoutes);

// Route API episode
app.use('/api/anime', episodeRoutes);

// Route API pencarian video YouTube
// GET /api/youtube/search?judul=Naruto
app.use('/api/youtube', youtubeRoutes);

// Menangani endpoint yang tidak ditemukan
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint tidak ditemukan.',
    });
});

// Menangani error yang tidak tertangani oleh route
app.use((err, req, res, next) => {
    console.error('Terjadi kesalahan server:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: 'Terjadi kesalahan pada server.',
    });
});

module.exports = app;
