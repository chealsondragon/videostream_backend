import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DisplayMovieRow from './DisplayMovieRow';

import * as api_video from '../../crud/videos.crud';
import { actions } from '../../store/ducks/videos.duck';

import * as api_mylist from '../../crud/my_list.crud';
import { actions as actions_mylist } from '../../store/ducks/my_list.duck';

import * as api_fetch from '../../crud/moviedb.crud';

function MainContent(props) {

  const [values, setValues] = React.useState({
    /** Will hold our chosen movie to display on the header */
    selectedMovie: {},
    summary : {
    },
    category : {
    }
  })

  React.useEffect(() => {
    api_video.loadAll()
      .then((res) => {
        props.loadAll(res.data || [])
        const firstMovie = res.data && res.data.data && res.data.data[0];
        setValues(values => ({ ...values, selectedMovie: firstMovie }));
      })
    api_mylist.loadAll()
      .then((res) => {
        props.loadAllMylist(res.data || [])
      })
    api_fetch.fetchBySummary()
      .then((res) => {
        setValues(values => ({ 
          ...values, 
          summary: res.data || {}
        }));
      })
    api_fetch.fetchByCategories()
      .then((res) => {
        setValues(values => ({ 
          ...values, 
          category: res.data || {}
        }));
      })

    return () => {
      setValues(values => ({ 
        ...values, 
        category: {},
        summary: {},
        selectedMovie: {},
      }));
    }
  }, [])

  const getMovie = () => {
    /** Movie Id for the Narcos series  */
    const movieId = 63351;
    /** Make Api call to retrieve the details for a single movie  */
    const url = `https://api.themoviedb.org/3/tv/${movieId}?api_key=${process.env.API_KEY}`;
    axios
      .get(url)
      .then(res => {
        const movieData = res.data;
        setValues(values => ({ ...values, selectedMovie: movieData }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onSelectMovie = (movieData) => {
    // setValues(values => ({ ...values, selectedMovie: movieData }));
    if(props.selectMovieHandler)
      props.selectMovieHandler(movieData);
  }

  return (
    <div className="container">
      <Header movie={values.selectedMovie} />
      <div className="movieShowcase">
        {
          Object.keys(values.summary).map((title) => {
            const ids = values.summary[title];
            if (ids.length > 0) {
              return (
                <DisplayMovieRow
                  selectMovieHandler={onSelectMovie}
                  key={title}
                  title={title}
                  movies={ids}
                />)
            }
          })
        }
        {
          Object.keys(values.category).map((title) => {
            const ids = values.category[title];
            if (ids.length > 0) {
              return (
                <DisplayMovieRow
                  selectMovieHandler={onSelectMovie}
                  key={title}
                  title={title}
                  movies={ids}
                />)
            }
          })
        }
      </div>
      <Footer />
    </div>
  );
}

export default injectIntl(
  connect(
    ({ videos, my_list }) => ({ videos, my_list }),
    {
      ...actions,
      loadAllMylist: actions_mylist.loadAll
    }
  )(MainContent)
); 