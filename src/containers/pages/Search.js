import React, { Component } from 'react';

import Modal from '../../components/UI/Modal';
import MovieDetails from '../../components/Movie/MovieDetails';
import Movie from '../../components/Movie/Movie';
import axios from "../../axios-movies"

export default function Search(props) {
  const [values, setValues] = React.useState({
    movies: [],
    toggleModal: false,
    /** Holds the movie information for a single movie. */
    movieOverview: {},
  });

  React.useEffect(() => {
  }, []);

  const closeModal = () => {
    setValues(values => ({ ...values, toggleModal: false }));
  }

  /* Get the appropriate details for a specific movie that was clicked */
  const selectMovieHandler = (movie) => {
    setValues(values => ({ ...values, toggleModal: true }));

    let url;
    /** Make the appropriate API call to get the details for a single movie or tv show. */
    if (movie.media_type === "movie") {
      const movieId = movie.id;
      url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`;

    } else if (movie.media_type === "tv") {
      const tvId = movie.id
      url = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${process.env.API_KEY}`;
    }

    axios.get(url)
      .then(res => {
        const movieData = res.data;
        setValues(values => ({ ...values, movieOverview: movieData }));
      }).catch(error => {
        console.log(error);
      });
  }

  const { location: { movies } } = props;
  const { toggleModal, movieOverview } = values
  const { userInput } = props.location

  return (
    <>
      {
        movies && movies.length > 0 ? (
          <div className="search-container">
            {
              movies.map((movie) => {
                let movieRows = []
                let movieImageUrl;
                if (movie.poster_path !== null && movie.media_type !== "person") {
                  movieImageUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

                  /** Set the movie object to our Movie component */
                  const movieComponent = <Movie
                    movieDetails={() => selectMovieHandler(movie)}
                    key={movie.id}
                    movieImage={movieImageUrl}
                    movie={movie} />

                  /** Push our movie component to our movieRows array */
                  movieRows.push(movieComponent);
                }
                return movieRows
              })
            }
          </div>
        ) : (
            <div className="no-results">
              <div className="no-results__text">
                <p>Your search for "{userInput}" did not have any matches.</p>
                <p>Suggestions:</p>
                <ul>
                  <li>Try different keywords</li>
                  <li>Looking for a movie or TV show?</li>
                  <li>Try using a movie, TV show title, an actor or director</li>
                  <li>Try a genre, like comedy, romance, sports, or drama</li>
                </ul>
              </div>
            </div>
          )
      }
      <Modal Modal show={toggleModal}
        modalClosed={closeModal}
        movie={movieOverview} >
        <MovieDetails movie={movieOverview} />
      </Modal>
    </>
  );
}
