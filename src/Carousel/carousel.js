import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useState, useEffect } from "react";
import { fetchShows } from "../api";
import "./carousel.css";
import { Link } from "react-router-dom";

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

function CarouselSlide() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAvailableShows = async () => {
      try {
        const data = await fetchShows();
        setShows(data);
        setLoading(false); // Data loaded, set loading to false
      } catch (error) {
        console.error("Error fetching shows:", error);
        setLoading(false); // Error occurred, set loading to false
      }
    };

    fetchAvailableShows();
  }, []);

  return (
    <div className="carousel-container">
      {loading ? ( // Render loading state if loading is true
        <p>Loading...</p>
      ) : (
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          showArrows={true}
          centerMode={true}
          centerSlidePercentage={20}
          emulateTouch={true}
          swipeable={true}
          infiniteLoop={true}
          selectedItem={2}
          interval={5000}
        >
          {shows.map((show) => (
            <div key={show.id} className="carousel-card">
              <Link className="Link" to={`/podcast/${show.id}`}>
                <img
                  src={show.image}
                  alt={show.title}
                  className="carousel-image"
                />
                <div className="carousel-details">
                  <h2 className="carousel-title">{show.title}</h2>
                  <p className="carousel-seasons">
                    <span className="design">Seasons:</span> {show.seasons}
                  </p>
                  <p className="carousel-genre">
                    <span className="design">Genres: </span>
                    {show.genres
                      .map((genreId) => genreMapping[genreId])
                      .join(", ")}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}

export default CarouselSlide;
