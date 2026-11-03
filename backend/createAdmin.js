
require('dotenv').config();

const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function buatAdmin() {
    try {
        const nama = 'Administrator';
        const email = 'admin@animeverse.com';
        const password = process.env.ADMIN_INITIAL_PASSWORD;

        if (!password || password.length < 12) {
            throw new Error(
                'Isi ADMIN_INITIAL_PASSWORD dengan password minimal 12 karakter di .env.'
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `INSERT INTO admins (nama, email, password_hash)
             VALUES ($1, $2, $3)
             ON CONFLICT (email) DO NOTHING`,
            [nama, email, passwordHash]
        );

        console.log(
            'Akun admin sudah disiapkan untuk admin@animeverse.com.'
        );
    } finally {
        await pool.end();
    }
}

buatAdmin().catch((error) => {
    console.error('Gagal membuat admin:', error.message);
    process.exitCode = 1;
});
