
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../../db');

async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email dan password wajib diisi.',
            });
        }

        const hasil = await pool.query(
            `SELECT id, nama, email, password_hash
             FROM admins
             WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        if (hasil.rows.length === 0) {
            return res.status(401).json({
                message: 'Email atau password salah.',
            });
        }

        const admin = hasil.rows[0];

        const cocok = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!cocok) {
            return res.status(401).json({
                message: 'Email atau password salah.',
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET belum dikonfigurasi.');
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: 'admin',
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '8h',
            }
        );

        return res.json({
            message: 'Login berhasil.',
            token,
            admin: {
                id: admin.id,
                nama: admin.nama,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error('Login admin gagal:', error.message);

        return res.status(500).json({
            message: 'Terjadi kesalahan saat login.',
        });
    }
}

module.exports = { loginAdmin };
