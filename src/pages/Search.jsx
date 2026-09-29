import { useState } from "react";
import { API_KEY, BASE_URL } from "../api";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

function Search() {
  const [query, setQuery] = useState("");
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
      if (!res.ok) throw new Error("Gagal mencari film");
      const data = await res.json();

      setMovies(data.results);
      setTotalPages(Math.min(data.total_pages, 20));
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(query, 1);
  };

  return (
    <div>
      <h2 className="section-title">🔍 Search Movies</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Cari judul film..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Cari</button>
      </form>

      {loading && <Loading />}
      {error && <p className="error">{error}</p>}

      {!loading && searched && movies.length === 0 && (
        <p className="empty">Film tidak ditemukan.</p>
      )}

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
      {movies.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => searchMovies(query, page - 1)}
            disabled={page === 1 || loading}
          >
            ← Prev
          </button>

          <span>
            Halaman {page} dari {totalPages}
          </span>

          <button
            onClick={() => searchMovies(query, page + 1)}
            disabled={page === totalPages || loading}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Search;
