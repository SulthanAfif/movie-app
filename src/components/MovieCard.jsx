import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../api";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750/161a22/8b93a7?text=No+Image";

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="poster-wrapper">
        <img src={poster} alt={movie.title} loading="lazy" />
        {rating && (
          <div className="rating">
            <span>★</span> {rating}
          </div>
        )}
        <div className="poster-overlay">
          <div className="overlay-title">{movie.title}</div>
          <div className="overlay-meta">{year}</div>
        </div>
      </div>
      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-year">{year}</p>
    </Link>
  );
}

export default MovieCard;
