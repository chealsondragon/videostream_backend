import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";

import URL from '../../helpers/url';

import Modal from '../../components/UI/Modal';
import MovieDetails from '../../components/Movie/MovieDetails';
import Movie from '../../components/Movie/Movie';

import * as api_fetch from '../../crud/moviedb.crud';

function Search(props) {
  const [values, setValues] = React.useState({
    movies: [],
    toggleModal: false,
    /** Holds the movie information for a single movie. */
    movieOverview: {},
  });
  
  const { location: { pathname, userInput } } = props;

  React.useEffect(() => {
    if(pathname === URL.SEARCH()){
      api_fetch.fetchbyName(userInput)
        .then((res) => {
          setValues(values => ({ 
            ...values, 
            movies: res.data || {}
          }));
        })
    }else if(pathname === URL.MYLIST()){
    }else{
      api_fetch.fetchByTag(pathname.replace("/", ""))
        .then((res) => {
          setValues(values => ({ 
            ...values, 
            movies: res.data || {}
          }));
        })
    }
  }, [pathname, userInput]);

  const closeModal = () => {
    setValues(values => ({ ...values, toggleModal: false }));
  }

  /* Get the appropriate details for a specific movie that was clicked */
  const selectMovieHandler = (movie) => {
    setValues(values => ({ ...values, toggleModal: true, movieOverview: movie }));
  }

  const allMovieDict = React.useMemo(() => {
    let ret = {};
    props.videos.list.map((video) => {
      return ret[video.id] = video;
    });
    return ret;
  }, [props.videos]);

  var { toggleModal, movieOverview, movies } = values
  
  if(pathname === URL.MYLIST())
    movies = props.my_list.list;

  return (
    <>
      {
        movies && movies.length > 0 ? (
          <div className="search-container">
            {
              movies.map((movie_id) => {
                let movieRows = []
                let movieData = allMovieDict && allMovieDict[movie_id];
                let movieImageUrl = movieData && movieData.title_logo
                if (movieData && movieImageUrl) {
                  /** Set the movie object to our Movie component */
                  const movieComponent = <Movie
                    movieDetails={() => selectMovieHandler(movieData)}
                    key={movie_id}
                    movieImage={movieImageUrl}
                    movie={movieData} />

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
                <p>No videos.</p>
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

export default injectIntl(
  connect(
    ({ videos, my_list }) => ({ videos, my_list }),
    null
  )(Search)
);