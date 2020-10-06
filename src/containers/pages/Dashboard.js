import React, { Component } from 'react';

import MainContent from './MainContent';
import Modal from '../../components/UI/Modal';
import MovieDetails from '../../components/Movie/MovieDetails';

function Home(props) {
  const [values, setValues] = React.useState({
    /** Toggles the modal when a movie is clicked. */
    toggleModal: false,
    /** Holds the movie information for a single movie. */
    movieOverview: {},
  });

  const selectMovieHandler = async (movie) => {
    setValues(values => ({ ...values, toggleModal: true, movieOverview: movie }));
  }

  const closeModal = () => {
    setValues(values => ({ ...values, toggleModal: false }));
  }

  return (
    <>
      <div className="main-content">
        <MainContent selectMovieHandler={selectMovieHandler} />
      </div>
      <Modal show={values.toggleModal}
        modalClosed={closeModal}
        movie={values.movieOverview}>
        <MovieDetails movie={values.movieOverview} />
      </Modal>
    </>
  );
}

export default Home;