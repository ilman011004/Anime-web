
function validasiAnime(data) {
    const { judul, genre, tahun, sinopsis, poster_url } = data;

    if (
        !judul ||
        typeof judul !== 'string' ||
        !judul.trim()
    ) {
        return 'Judul anime wajib diisi.';
    }

    if (
        !genre ||
        typeof genre !== 'string' ||
        !genre.trim()
    ) {
        return 'Genre anime wajib diisi.';
    }

    if (
        tahun === undefined ||
        tahun === null ||
        tahun === '' ||
        !Number.isInteger(Number(tahun)) ||
        Number(tahun) < 1900 ||
        Number(tahun) > 2100
    ) {
        return 'Tahun anime harus berupa angka antara 1900 dan 2100.';
    }

    if (
        sinopsis !== undefined &&
        sinopsis !== null &&
        typeof sinopsis !== 'string'
    ) {
        return 'Sinopsis harus berupa teks.';
    }

    if (
        poster_url !== undefined &&
        poster_url !== null &&
        poster_url !== ''
    ) {
        try {
            const url = new URL(poster_url);

            if (!['http:', 'https:'].includes(url.protocol)) {
                return 'URL poster harus menggunakan HTTP atau HTTPS.';
            }
        } catch {
            return 'URL poster tidak valid.';
        }
    }

    return null;
}

module.exports = { validasiAnime };
