
const { pool } = require('../../db');

async function imporAnimeDariAniList() {
    const query = `
        query {
            Page(page: 1, perPage: 20) {
                media(
                    type: ANIME
                    sort: POPULARITY_DESC
                    isAdult: false
                ) {
                    id
                    title {
                        english
                        romaji
                    }
                    genres
                    description(asHtml: false)
                    startDate {
                        year
                    }
                    seasonYear
                    coverImage {
                        large
                        extraLarge
                    }
                }
            }
        }
    `;

    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error(
            `AniList API gagal merespons. Status: ${response.status}`
        );
    }

    const hasilApi = await response.json();

    if (hasilApi.errors || !hasilApi.data?.Page?.media) {
        throw new Error('Data anime dari AniList gagal dibaca.');
    }

    const daftarAnime = hasilApi.data.Page.media;

    let berhasilDitambahkan = 0;
    let dilewati = 0;

    for (const anime of daftarAnime) {
        const judul = anime.title.english || anime.title.romaji;
        const genre = anime.genres.join(', ');
        const tahun = anime.startDate.year || anime.seasonYear;
        const sinopsis = anime.description || null;

        const posterUrl =
            anime.coverImage.extraLarge ||
            anime.coverImage.large ||
            null;

        if (!judul || !genre || !tahun) {
            dilewati++;
            continue;
        }

        const hasil = await pool.query(
            `INSERT INTO anime
                (judul, genre, tahun, sinopsis, poster_url)
             SELECT
                $1::text,
                $2::text,
                $3::integer,
                $4::text,
                $5::text
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM anime
                 WHERE LOWER(TRIM(judul)) = LOWER(TRIM($1::text))
             )
             RETURNING id`,
            [
                judul,
                genre,
                Number(tahun),
                sinopsis,
                posterUrl,
            ]
        );

        if (hasil.rowCount > 0) {
            berhasilDitambahkan++;
        } else {
            dilewati++;
        }
    }

    return {
        message: 'Proses impor katalog anime selesai.',
        jumlahDariAniList: daftarAnime.length,
        berhasilDitambahkan,
        dilewati,
    };
}

module.exports = { imporAnimeDariAniList };
