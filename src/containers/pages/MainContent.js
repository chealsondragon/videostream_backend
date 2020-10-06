import React, { Component } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  fetchNetflixOriginals,
  fetchTrending,
  fetchTopRated,
  fetchActionMovies,
  fetchComedyMovies,
  fetchDocumentaries,
  fetchHorrorMovies
} from '../../crud/moviedb.crud';
import DisplayMovieRow from './DisplayMovieRow';

function MainContent(props) {

  const [values, setValues] = React.useState({
    /** Will hold our chosen movie to display on the header */
    selectedMovie: {},
    movieInfo: {
      originals: {
        title: 'Originals',
        url: `/discover/tv?api_key=${process.env.API_KEY}&with_networks=213`,
        movies: [],
      },
      trending: {
        title: 'Trending Now',
        url: `/trending/all/week?api_key=${process.env.API_KEY}&language=en-US`,
        movies: [],
      },
      top: {
        title: 'Top Rated',
        url: `/movie/top_rated?api_key=${process.env.API_KEY}&language=en-US`,
        movies: [],
      },
      action : {
        title: 'Action Movies',
        url: `/discover/movie?api_key=${process.env.API_KEY}&with_genres=28`,
        movies: [],
      },
      comedy: {
        title: 'Comedy Movies',
        url: `/discover/tv?api_key=${process.env.API_KEY}&with_genres=35`,
        movies: [],
      },
      horror: {
        title: 'Horror Movies',
        url: `/discover/tv?api_key=${process.env.API_KEY}&with_genres=27`,
        movies: [],
      },
      documentries: {
        title: 'Documentaries',
        url: `/discover/tv?api_key=${process.env.API_KEY}&with_genres=99`,
        movies: [],
      },
    },
  })

  React.useEffect(() => {
    getMovie();
    fetchNetflixOriginals()
      .then((res) => {
        setValues(values => ({ ...values, movieInfo: { ...values.movieInfo, originals: { ...values.movieInfo.originals, movies: res.data.results } } }));
      })
    fetchTrending()
      .then((res) => {
        setValues(values => ({ ...values, movieInfo: { ...values.movieInfo, trending: { ...values.movieInfo.trending, movies: res.data.results } } }));
      })
    fetchTopRated()
      .then((res) => {
        setValues(values => ({ ...values, movieInfo: { ...values.movieInfo, top: { ...values.movieInfo.top, movies: res.data.results } } }));
      })
    fetchActionMovies()
      .then((res) => {
        setValues(values => ({ ...values, movieInfo: { ...values.movieInfo, action: { ...values.movieInfo.action, movies: res.data.results } } }));
      })
    fetchComedyMovies()
      .then((res) => {
        setValues(values => ({ ...values, movieInfo: { ...values.movieInfo, comedy: { ...values.movieInfo.comedy, movies: res.data.results } } }));
      })
    fetchDocumentaries()
      .then((res) => {
        setValues(values => ({ ...values, movieInfo: { ...values.movieInfo, documentries: { ...values.movieInfo.documentries, movies: res.data.results } } }));
      })
    fetchHorrorMovies()
      .then((res) => {
        setValues(values => ({ ...values, movieInfo: { ...values.movieInfo, horror: { ...values.movieInfo.horror, movies: res.data.results } } }));
      })
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
    setValues(values => ({ ...values, selectedMovie: movieData }));
    if(props.selectMovieHandler)
      props.selectMovieHandler(movieData);
  }

  return (
    <div className="container">
      <Header movie={values.selectedMovie} />
      <div className="movieShowcase">
        {
          Object.keys(values.movieInfo).map((key) => {
            const info = values.movieInfo[key];
            if (info.movies.length > 0) {
              return (
                <DisplayMovieRow
                  selectMovieHandler={onSelectMovie}
                  key={info.title}
                  title={info.title}
                  url={info.url}
                  movies={info.movies}
                />)
            }
          })
        }
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // netflixOriginals: state.netflixOriginals,
    // trending: state.trending,
    // topRated: state.topRated,
    // actionMovies: state.action,
    // comedyMovies: state.comedy,
    // documentaries: state.documentary,
    // horrorMovies: state.horror
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    // fetchNetflixOriginals,
    // fetchTrending,
    // fetchTopRated,
    // fetchActionMovies,
    // fetchComedyMovies,
    // fetchDocumentaries,
    // fetchHorrorMovies
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContent); 