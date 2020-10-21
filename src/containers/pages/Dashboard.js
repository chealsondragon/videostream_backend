import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";

import MainContent from './MainContent';
import Modal from '../../components/UI/Modal';
import MovieDetails from '../../components/Movie/MovieDetails';

import * as api from '../../crud/videos.crud';
import * as actions from '../../store/ducks/videos.duck';

function Dashboard(props) {
  const firstMovie = props.videos.list[0];
  const [values, setValues] = React.useState({
    /** Toggles the modal when a movie is clicked. */
    toggleModal: false,
    /** Holds the movie information for a single movie. */
    movieOverview: firstMovie,
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

export default injectIntl(
  connect(
    ({ videos }) => ({ videos }),
    {
      ...actions
    }
  )(Dashboard)
);