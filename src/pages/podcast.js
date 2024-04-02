import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./pagesStyling/podcast.css";
import ReactAudioPlayer from "react-audio-player";

const Podcast = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState({});
  const [podcastSeason, setPodcastSeason] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true);
        const response = await fetchPodcastData(id);
        const data = await response.json();
        setPodcast(data);
        setPodcastSeason(data.seasons[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  useEffect(() => {
    const handleWindowClose = (event) => {
      if (currentAudio !== null) {
        return "Audio is currently playing. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [currentAudio]);

  const fetchPodcastData = async (id) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch podcast data: ${error.message}`);
    }
  };

  const handleSelectSeason = (e) => {
    const selectedSeason = podcast.seasons.find(
      (season) => season.season === parseInt(e.target.value)
    );
    setPodcastSeason(selectedSeason);
  };

  const handleAudioPlay = (index) => {
    if (currentAudio !== null && currentAudio !== index) {
      // If there is an audio playing, pause it
      document.getElementById(`audio-${currentAudio}`).pause();
    }
    setCurrentAudio(index);
  };

  const handleBackClick = () => {
    if (currentAudio !== null) {
      const confirmation = window.confirm(
        "Audio is currently playing. Are you sure you want to leave?"
      );
      if (!confirmation) {
        return; // Stay on the page
      }
    }
    navigate(-1); // Navigate back
  };

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const newFavorite = {
      id: podcast.id,
      title: podcast.title,
      description: podcast.description,
      image: podcastSeason.image,
      dateAdded: new Date().toISOString(),
      seasons: podcast.seasons,
    };
    favorites.push(newFavorite);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  if (loading)
    return (
      <div className="loading-message">
        <p>Loading...</p>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="podcast-container">
      <p className="back-link" onClick={handleBackClick}>
        Back
      </p>
      <img
        src={podcastSeason.image}
        alt={podcast.title}
        className="showimage"
      />
      <div className="showdetails">
        <h2 className="showtitle">{podcast.title}</h2>
        <p className="showdescription">
          <span className="description">Description:</span>
          <br />
          {podcast.description}
        </p>
        <br />
        <button onClick={handleAddToFavorites}>Add to Favorites</button>
        <div className="showseason">
          <label htmlFor="seasons" className="description">
            Seasons:
          </label>
          <select name="seasons" id="seasons" onChange={handleSelectSeason}>
            <option value="">Select a season</option>
            {podcast.seasons &&
              podcast.seasons.map((season) => (
                <option key={season.season} value={season.season}>
                  {season.title} (Season {season.season})
                </option>
              ))}
          </select>
        </div>
        <div className="show-episode">
          <h2 className="season-title">Season: {podcastSeason.season}</h2>
          <p className="episode-title">
            Episodes: {podcastSeason.episodes?.length || 0}
          </p>
          <br />
          <span className="episode-container">
            {podcastSeason.episodes &&
              podcastSeason.episodes.map((episode, index) => (
                <div key={episode.episode} className="episode-card">
                  <h3>{episode.title}</h3>
                  <p>Episode {episode.episode}</p>
                  <p>{episode.description}</p>
                  <ReactAudioPlayer
                    src={episode.file}
                    autoPlay={false}
                    controls
                    id={`audio-${index}`}
                    onPlay={() => handleAudioPlay(index)}
                  />
                </div>
              ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
