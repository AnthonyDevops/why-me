//home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./pagesStyling/home.css"
import CarouselSlide from "../Carousel/carousel";

const genreMapping = {
  1: "Personal Growth",
  2: "True Crime and Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family",
};

function Home() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const response = await fetchPodcastData(
          "https://podcast-api.netlify.app/shows"
        );
        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const fetchPodcastData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch podcast data: ${error.message}`);
    }
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + " ...";
    }
    return description;
  };

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    setSortOrder(selectedValue);

    const sortedPodcasts = [...podcasts];
    if (selectedValue === "az") {
      sortedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedValue === "za") {
      sortedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedValue === "asc") {
      sortedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    } else if (selectedValue === "desc") {
      sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }
    setPodcasts(sortedPodcasts);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <div className="main-container">
        <br />
        <h1 className="head">You might like these:</h1>
        <br />
        <CarouselSlide />
        <br />
        <br />
        <div className="sort-search-container">
          <div className="find"></div>
          <div>
            <label htmlFor="sort">Sort Podcasts: </label>
            <select id="sort" onChange={handleSortChange} value={sortOrder}>
              <option value="">Sorted by</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
              <option value="asc">Ascending Order</option>
              <option value="desc">Descending Order</option>
            </select>
          </div>
          <div>
            <label htmlFor="search">Search: </label>
            <input
              type="text"
              id="search"
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
        </div>
        <br />
        <br />
        {loading ? (
          <div className="loading-message">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          filteredPodcasts.map((show) => (
            <div key={show.id} className="show-card">
              <Link className="Link" to={`/podcast/${show.id}`}>
                <img src={show.image} alt={show.title} className="show-image" />
                <div className="show-details">
                  <h2 className="show-title">{show.title}</h2>
                  <p className="show-season">
                    <span className="maindesign">Seasons:</span> {show.seasons}
                  </p>
                  <p className="show-genre">
                    <span className="maindesign">Genres: </span>
                    {show.genres
                      .map((genreId) => genreMapping[genreId])
                      .join(", ")}
                  </p>
                  <p className="show-description">
                    <span className="maindesign">Description:</span>
                    {truncateDescription(show.description, 300)}
                  </p>
                  <p className="show-update">
                    <span className="maindesign">Updated:</span>{" "}
                    {new Date(show.updated).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Home;
