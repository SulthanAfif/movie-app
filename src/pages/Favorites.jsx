import { useState, useEffect } from "react";
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
        <p>Belum ada film favorit.</p>
        <p>Tambahkan film dari halaman detail.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">❤️ My Favorites</h2>
      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
