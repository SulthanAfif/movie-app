import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_KEY, BASE_URL, IMAGE_BASE_URL } from "../api";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        const [movieRes, videoRes, similarRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(
            `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`,
          ),
          fetch(
            `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`,
          ),
        ]);

        if (!movieRes.ok) throw new Error("Movie not found");

        const movieData = await movieRes.json();
        const videoData = await videoRes.json();
        const similarData = await similarRes.json();

        setMovie(movieData);
        setSimilar(similarData.results?.slice(0, 12) || []);

        const officialTrailer = videoData.results?.find(
          (vid) =>
            vid.site === "YouTube" &&
            (vid.type === "Trailer" || vid.type === "Teaser"),
        );
        setTrailer(officialTrailer || null);

        const saved = JSON.parse(localStorage.getItem("movie-favorites")) || [];
        setIsFavorite(saved.some((m) => m.id === movieData.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem("movie-favorites")) || [];

    if (isFavorite) {
      const updated = saved.filter((m) => m.id !== movie.id);
      localStorage.setItem("movie-favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      };
      localStorage.setItem(
        "movie-favorites",
        JSON.stringify([...saved, movieData]),
      );
      setIsFavorite(true);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return null;

  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750/161a22/8b93a7?text=No+Image";

  const backdrop = movie.backdrop_path
    ? `${BACKDROP_URL}${movie.backdrop_path}`
    : poster;

  return (
    <div className="movie-detail">
      <section className="detail-hero">
        <div className="detail-backdrop">
          <img src={backdrop} alt="" />
        </div>
        <div className="detail-gradient" />

        <div className="detail-body">
          <img src={poster} alt={movie.title} className="detail-poster" />

          <div className="detail-info">
            <Link to="/" className="back-btn">
              ← Back
            </Link>

            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}

            <div className="meta">
              {movie.vote_average > 0 && (
                <span className="rating-val">★ {movie.vote_average.toFixed(1)}</span>
              )}
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime > 0 && <span>{movie.runtime} min</span>}
            </div>

            <div className="genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="genre">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="overview">{movie.overview || "No overview available."}</p>

            <div className="detail-actions">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  ▶ Watch Trailer
                </a>
              )}
              <button
                className={`fav-btn ${isFavorite ? "active" : ""}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? "♥ In My List" : "♡ Add to My List"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {trailer && (
        <div className="trailer-section">
          <h2>Trailer</h2>
          <div className="trailer-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="similar-section">
          <h2 className="section-title">More Like This</h2>
          <div className="movie-row-scroll">
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
