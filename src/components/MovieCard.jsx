import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../api";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="poster-wrapper">
        <img src={poster} alt={movie.title} loading="lazy" />
        <div className="rating">⭐ {movie.vote_average?.toFixed(1)}</div>
      </div>
      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-year">
        {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
      </p>
    </Link>
  );
}

export default MovieCard;
