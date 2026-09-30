import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("movie-favorites")) || [];
    setFavorites(saved);
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="empty">
        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Your list is empty</p>
        <p style={{ marginBottom: "1.5rem" }}>
          Browse movies and add them to your list.
        </p>
        <Link to="/" className="btn-primary">
          Discover Movies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>My List</h2>
      </div>
      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
