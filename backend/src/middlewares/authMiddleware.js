
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // 1. Pastikan header Authorization tersedia
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Akses ditolak. Silakan login sebagai admin.',
        });
    }

    // 2. Ambil token dari header
    const token = authHeader.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            message: 'Token autentikasi tidak ditemukan.',
        });
    }

    // 3. Pastikan JWT_SECRET sudah dikonfigurasi
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET belum dikonfigurasi.');

        return res.status(500).json({
            message: 'Konfigurasi autentikasi server belum tersedia.',
        });
    }

    // 4. Verifikasi token dan hak akses admin
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (
            !decoded ||
            decoded.role !== 'admin' ||
            !decoded.id
        ) {
            return res.status(403).json({
                message: 'Akses hanya tersedia untuk admin.',
            });
        }

        // 5. Simpan identitas admin untuk digunakan controller
        req.admin = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        // 6. Lanjutkan ke route berikutnya
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token sudah kedaluwarsa. Silakan login kembali.',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token tidak valid. Silakan login kembali.',
            });
        }

        console.error('Kesalahan autentikasi:', error.message);

        return res.status(500).json({
            message: 'Terjadi kesalahan saat memverifikasi autentikasi.',
        });
    }
}

module.exports = authMiddleware;
