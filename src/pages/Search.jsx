import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { API_KEY, BASE_URL } from "../api";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

function Search() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const searchMovies = async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchQuery,
        )}&page=${pageNum}`,
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();

      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 20));
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) {
      setQuery(initialQ);
      searchMovies(initialQ, 1);
    }
  }, [initialQ]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(query, 1);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Search Movies</h2>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <Loading />}
      {error && <p className="error">{error}</p>}

      {!loading && searched && movies.length === 0 && (
        <p className="empty">No movies found. Try a different title.</p>
      )}

      {!loading && movies.length > 0 && (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => searchMovies(query, page - 1)}
              disabled={page === 1 || loading}
            >
              ← Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => searchMovies(query, page + 1)}
              disabled={page === totalPages || loading}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Search;
