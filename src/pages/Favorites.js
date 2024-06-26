import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./pagesStyling/favourites.css"; // Import the CSS file

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    // Retrieve favorites from local storage
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Function to sort favorites
  const sortFavorites = (sortBy) => {
    let sortedFavorites = [...favorites];
    switch (sortBy) {
      case "A-Z":
        sortedFavorites.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        sortedFavorites.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Asc":
        sortedFavorites.sort(
          (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
        );
        break;
      case "Desc":
        sortedFavorites.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
      default:
        break;
    }
    setFavorites(sortedFavorites);
  };

  const removeFromFavorites = (id) => {
    // Filter out the favorite with the given id
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    // Update local storage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    // Update state to reflect the change
    setFavorites(updatedFavorites);
  };

  const handleSelectSeason = (e, favoriteId) => {
    const selectedSeasonNumber = parseInt(e.target.value);
    setSelectedSeason({ favoriteId, seasonNumber: selectedSeasonNumber });
  };

  return (
    <div className="podcast-container">
      {/* Apply podcast-container class */}
      <h2>Favorites</h2>
      <div className="sorting-options">
        <label className="label">Sort by: </label>
        <select onChange={(e) => sortFavorites(e.target.value)}>
          <option value="">Select</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Asc">Date Added Ascending</option>
          <option value="Desc">Date Added Descending</option>
        </select>
      </div>
      <Link to="/" className="back-link">
        {" "}
        {/* Apply back-link class */}
        Back
      </Link>{" "}
      {/* Back button */}
      {favorites.map((favorite) => (
        <div key={favorite.id} className="favorite-item">
          {/* Apply favorite-item class */}
          <img
            src={favorite.image}
            alt={favorite.title}
            className="showimage"
          />
          <div className="showdetails">
            {/* Apply showdetails class */}
            <h3 className="showtitle">{favorite.title}</h3>
            {/* Apply showtitle class */}
            <p className="showdescription">{favorite.description}</p>
            {/* Apply showdescription class */}
            <p className="date-added">Added: {favorite.dateAdded}</p>{" "}
            {/* Display date added */}
            <div className="season-dropdown">
              {/* Apply season-dropdown class */}
              <label htmlFor={`season-select-${favorite.id}`} classname="season-label">
                Select Season:
              </label>
              <select
                id={`season-select-${favorite.id}`}
                onChange={(e) => handleSelectSeason(e, favorite.id)}
              >
                <option value="">All Seasons</option>
                {favorite.seasons &&
                  favorite.seasons.map((season) => (
                    <option key={season.season} value={season.season}>
                      Season {season.season}
                    </option>
                  ))}
              </select>
            </div>
            {selectedSeason &&
              selectedSeason.favoriteId === favorite.id &&
              favorite.seasons &&
              favorite.seasons
                .filter(
                  (season) => season.season === selectedSeason.seasonNumber
                )
                .map((season) => (
                  <div key={season.season} className="season">
                    {/* Apply season class */}
                    <h4 className="season-title">Season {season.season}</h4>
                    {/* Apply season-title class */}
                    {season.episodes.map((episode) => (
                      <div key={episode.episode} className="episode-card">
                        {/* Apply episode-card class */}
                        <p className="episode-title">{episode.title}</p>
                        {/* Apply episode-title class */}
                        <p>{episode.description}</p>
                        <audio controls src={episode.file}></audio>
                      </div>
                    ))}
                  </div>
                ))}
            {selectedSeason && selectedSeason.favoriteId !== favorite.id && (
              <div className="error">No season selected for this favorite.</div>
            )}
            {selectedSeason === null &&
              favorite.seasons &&
              favorite.seasons.map((season) => (
                <div key={season.season} className="season">
                  {/* Apply season class */}
                  <h4 className="season-title">Season {season.season}</h4>
                  {/* Apply season-title class */}
                  {season.episodes.map((episode) => (
                    <div key={episode.episode} className="episode-card">
                      {/* Apply episode-card class */}
                      <p className="episode-title">{episode.title}</p>
                      {/* Apply episode-title class */}
                      <p>{episode.description}</p>
                      <div className="audio-container">
                        <audio controls src={episode.file}></audio>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            <button onClick={() => removeFromFavorites(favorite.id)}>
              Remove from Favorites
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favorites;
