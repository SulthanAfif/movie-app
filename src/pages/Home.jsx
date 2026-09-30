import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_KEY, BASE_URL, IMAGE_BASE_URL } from "../api";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

const CATEGORIES = [
  { key: "popular", label: "Popular" },
  { key: "top_rated", label: "Top Rated" },
  { key: "now_playing", label: "Now Playing" },
  { key: "upcoming", label: "Upcoming" },
];

const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

function Home() {
  const [category, setCategory] = useState("popular");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();

        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 20));

        // Set hero from first movie with backdrop (only on first page, no genre filter)
        if (page === 1 && !selectedGenre && data.results?.length) {
          const withBackdrop = data.results.find((m) => m.backdrop_path) || data.results[0];
          setHero(withBackdrop);
        }
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

  if (loading && page === 1 && !hero) return <Loading />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      {/* Hero Banner */}
      {hero && !selectedGenre && page === 1 && (
        <section className="hero">
          <div className="hero-backdrop">
            <img
              src={
                hero.backdrop_path
                  ? `${BACKDROP_URL}${hero.backdrop_path}`
                  : hero.poster_path
                    ? `${IMAGE_BASE_URL}${hero.poster_path}`
                    : ""
              }
              alt={hero.title}
            />
          </div>
          <div className="hero-gradient" />
          <div className="hero-content">
            <span className="hero-badge">Featured</span>
            <h1 className="hero-title">{hero.title}</h1>
            <div className="hero-meta">
              {hero.vote_average > 0 && (
                <span className="rating">★ {hero.vote_average.toFixed(1)}</span>
              )}
              {hero.release_date && <span>{hero.release_date.slice(0, 4)}</span>}
            </div>
            <p className="hero-overview">{hero.overview}</p>
            <div className="hero-actions">
              <Link to={`/movie/${hero.id}`} className="btn-primary">
                ▶ View Details
              </Link>
              <Link to={`/movie/${hero.id}`} className="btn-secondary">
                + My List
              </Link>
            </div>
          </div>
        </section>
      )}

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

      <div className="genre-filter">
        {genres.slice(0, 12).map((g) => (
          <button
            key={g.id}
            className={selectedGenre === g.id ? "active" : ""}
            onClick={() => handleGenreClick(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
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
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
