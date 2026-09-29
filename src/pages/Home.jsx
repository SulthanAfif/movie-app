import { useState, useEffect } from "react";
import { API_KEY, BASE_URL } from "../api";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

const CATEGORIES = [
  { key: "popular", label: "Popular" },
  { key: "top_rated", label: "Top Rated" },
  { key: "now_playing", label: "Now Playing" },
  { key: "upcoming", label: "Upcoming" },
];

function Home() {
  const [category, setCategory] = useState("popular");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil daftar genre
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGenres();
  }, []);

  // Ambil film
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);

        let url = "";
        if (selectedGenre) {
          url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${selectedGenre}&page=${page}&sort_by=popularity.desc`;
        } else {
          url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=en-US&page=${page}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();

        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 20));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, selectedGenre, page]);

  const handleCategoryChange = (key) => {
    setCategory(key);
    setSelectedGenre(null);
    setPage(1);
  };

  const handleGenreClick = (id) => {
    setSelectedGenre(id === selectedGenre ? null : id);
    setPage(1);
  };

  if (loading) return <Loading />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2 className="section-title">🎬 Discover Movies</h2>

      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={category === cat.key && !selectedGenre ? "active" : ""}
            onClick={() => handleCategoryChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Genre Filter */}
      <div className="genre-filter">
        {genres.slice(0, 10).map((g) => (
          <button
            key={g.id}
            className={selectedGenre === g.id ? "active" : ""}
            onClick={() => handleGenreClick(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Prev
        </button>
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Home;
