# CineStream

Aplikasi pencarian film modern yang dibangun dengan React + Vite. Jelajahi film populer, cari berdasarkan judul, tonton trailer, dan simpan favorit — dengan UI sinematik terinspirasi dari Prime Video dan JustWatch.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TMDB](https://img.shields.io/badge/API-TMDB-01D277?logo=themoviedatabase&logoColor=white)

---

## Live Demo

https://movie-app-rho-khaki.vercel.app/

---

## Fitur

- **Hero banner** — Film unggulan dengan backdrop, rating, dan tombol aksi
- **Jelajahi berdasarkan kategori** — Popular, Top Rated, Now Playing, Upcoming
- **Filter genre** — Saring hasil berdasarkan genre
- **Pencarian** — Cari film berdasarkan judul (di navbar + halaman khusus)
- **Detail film** — Backdrop hero, poster, sinopsis, genre, durasi, embed trailer
- **My List** — Simpan / hapus favorit (disimpan di `localStorage`)
- **Film serupa** — Baris scroll horizontal berisi judul terkait
- **Responsif** — Tampil baik di desktop, tablet, dan mobile
- **Tema gelap sinematik** — Gaya UI platform streaming

---

## Tech Stack

| Layer        | Teknologi                           |
|--------------|-------------------------------------|
| Framework    | React 19                            |
| Build tool   | Vite 8                              |
| Routing      | React Router DOM 7                  |
| API          | [The Movie Database (TMDB)](https://www.themoviedb.org/) |
| Styling      | Custom CSS (CSS variables)          |
| Font         | Inter (Google Fonts)                |
| Storage      | `localStorage` (favorit)            |

---

## Struktur Proyek

```
movie-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # Gambar statis
│   ├── components/
│   │   ├── Loading.jsx      # Spinner loading
│   │   ├── MovieCard.jsx    # Kartu poster film
│   │   └── Navbar.jsx       # Navigasi atas + search
│   ├── pages/
│   │   ├── Home.jsx         # Discover + hero
│   │   ├── Search.jsx       # Hasil pencarian
│   │   ├── MovieDetail.jsx  # Halaman detail
│   │   └── Favorites.jsx    # My List
│   ├── api.js               # Endpoint & key TMDB
│   ├── App.jsx              # Definisi routes
│   ├── App.css              # Style utama
│   ├── index.css            # Design tokens & reset
│   └── main.jsx             # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Cara Menjalankan

### Prasyarat

- **Node.js** 18+ (disarankan 20+)
- **npm** 9+ (atau yarn / pnpm)

### 1. Clone / ekstrak

```bash
# Jika dari file zip
unzip movie-app.zip
cd movie-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Atur API key (opsional)

Aplikasi sudah dilengkapi key TMDB demo di `src/api.js`. Untuk production, buat key gratis sendiri:

1. Daftar di [themoviedb.org](https://www.themoviedb.org/signup)
2. Buka **Settings → API** dan minta API key
3. Ganti nilai di `src/api.js`:

```js
const API_KEY = "API_KEY_TMDB_ANDA";
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173).

### 5. Build production

```bash
npm run build
npm run preview   # pratinjau hasil build
```

Output ada di folder `dist/`.

---

## Script yang Tersedia

| Perintah          | Keterangan                              |
|-------------------|-----------------------------------------|
| `npm run dev`     | Menjalankan Vite dev server (HMR)       |
| `npm run build`   | Build untuk production                  |
| `npm run preview` | Menyajikan hasil build secara lokal     |
| `npm run lint`    | Menjalankan ESLint                      |

---

## Halaman & Routes

| Path            | Halaman       | Keterangan                                   |
|-----------------|---------------|----------------------------------------------|
| `/`             | Home          | Hero + kategori + filter genre + grid        |
| `/search`       | Search        | Form pencarian + hasil                       |
| `/search?q=...` | Search        | Terisi otomatis dari search di navbar        |
| `/movie/:id`    | Detail Film   | Backdrop, trailer, film serupa               |
| `/favorites`    | My List       | Favorit yang disimpan di localStorage        |

---

## Referensi API (TMDB)

Base URL: `https://api.themoviedb.org/3`

| Endpoint                         | Kegunaan                 |
|----------------------------------|--------------------------|
| `GET /movie/popular`             | Film populer             |
| `GET /movie/top_rated`           | Rating tertinggi         |
| `GET /movie/now_playing`         | Sedang tayang            |
| `GET /movie/upcoming`            | Akan datang              |
| `GET /discover/movie`            | Discover berdasarkan genre |
| `GET /search/movie`              | Pencarian judul          |
| `GET /movie/{id}`                | Detail film              |
| `GET /movie/{id}/videos`         | Trailer / teaser         |
| `GET /movie/{id}/similar`        | Film serupa              |
| `GET /genre/movie/list`          | Daftar genre             |

Base URL gambar:

- Poster: `https://image.tmdb.org/t/p/w500`
- Backdrop: `https://image.tmdb.org/t/p/original`

---

## Fitur Lebih Detail

### Favorit (My List)

Favorit disimpan di browser:

```js
localStorage.getItem("movie-favorites")
// → [{ id, title, poster_path, vote_average, release_date }, ...]
```

Toggle dari halaman detail film. Tidak memerlukan backend.

### Pencarian

- Ketik di search bar navbar lalu Enter → pindah ke `/search?q=...`
- Halaman Search juga mendukung pagination

### Breakpoint responsif

- **Desktop** — hero penuh, grid lebar
- **Tablet (~900px)** — layout detail ditumpuk
- **Mobile (~600px)** — nav ringkas, grid 2 kolom, padding lebih kecil

---

## Design System

CSS custom properties di `src/index.css`:

| Token            | Nilai       | Peran                 |
|------------------|-------------|-----------------------|
| `--bg`           | `#0a0c10`   | Latar belakang halaman |
| `--bg-elevated`  | `#12151c`   | Kartu / input          |
| `--accent`       | `#00a8e1`   | Aksi utama             |
| `--rating`       | `#f5c518`   | Rating bintang         |
| `--text`         | `#f0f2f5`   | Teks utama             |
| `--text-muted`   | `#8b93a7`   | Teks sekunder          |
| `--border`       | `#2a2f3a`   | Border                 |
| `--nav-height`   | `64px`      | Tinggi navbar sticky   |

---

## Catatan Environment

- Proyek ini memakai **API key TMDB publik** untuk demo. Ada batas rate limit.
- Untuk production, pindahkan key ke environment variable dan pertimbangkan backend proxy agar key tidak terekspos.
- Gambar dan data berasal dari TMDB; patuhi [syarat penggunaan](https://www.themoviedb.org/documentation/api/terms-of-use) mereka.

Contoh dengan Vite env:

```bash
# .env
VITE_TMDB_API_KEY=key_anda_di_sini
```

```js
// src/api.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

---

## Dukungan Browser

- Chrome / Edge (versi terbaru)
- Firefox (versi terbaru)
- Safari (versi terbaru)
- Browser mobile (iOS Safari, Chrome Android)

---

## Lisensi

Proyek ini untuk keperluan edukasi / pribadi.

Data dan gambar film © [The Movie Database (TMDB)](https://www.themoviedb.org/). Produk ini menggunakan API TMDB tetapi tidak di-endorse atau disertifikasi oleh TMDB.

---

## Kredit

- UI terinspirasi dari [Prime Video](https://www.primevideo.com/) dan [JustWatch](https://www.justwatch.com/)
- Data dari [TMDB](https://www.themoviedb.org/)
- Dibangun dengan [React](https://react.dev/) + [Vite](https://vite.dev/)
