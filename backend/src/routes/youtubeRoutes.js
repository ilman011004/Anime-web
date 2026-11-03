
const express = require('express');
const router = express.Router();

const { cariVideo } = require('../controllers/youtubeController');

router.get('/search', cariVideo);

module.exports = router;
