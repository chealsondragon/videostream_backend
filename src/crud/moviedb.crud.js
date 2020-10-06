import axios from '../axios-movies';

export const FETCH_TRENDING = 'FETCH_TRENDING';
export const FETCH_NETFLIX_ORIGINALS = 'FETCH_NETFLIX_ORIGINALS';
export const FETCH_TOP_RATED = 'FETCH_TOP_RATED';
export const FETCH_ACTION_MOVIES = 'FETCH_ACTION_MOVIES';
export const FETCH_COMEDY_MOVIES = 'FETCH_COMEDY_MOVIES';
export const FETCH_HORROR_MOVIES = 'FETCH_HORROR_MOVIES';
export const FETCH_ROMANCE_MOVIES = 'FETCH_ROMANCE_MOVIES';
export const FETCH_DOCUMENTARIES = 'FETCH_DOCUMENTARIES';

export function fetchTrending() {
  return axios.get(
    `/trending/all/week?api_key=${process.env.API_KEY}&language=en-US`
  );
}

export function fetchNetflixOriginals() {
  return axios.get(
    `/discover/tv?api_key=${process.env.API_KEY}&with_networks=213`
  );
}

export function fetchTopRated() {
  return axios.get(
    `/movie/top_rated?api_key=${process.env.API_KEY}&language=en-US`
  );
}

export function fetchActionMovies() {
  return axios.get(
    `/discover/movie?api_key=${process.env.API_KEY}&with_genres=28`
  );
}

export function fetchComedyMovies() {
  return axios.get(
    `/discover/movie?api_key=${process.env.API_KEY}&with_genres=35`
  );
}

export function fetchHorrorMovies() {
  return axios.get(
    `/discover/movie?api_key=${process.env.API_KEY}&with_genres=27`
  );
}

export function fetchRomanceMovies() {
  return axios.get(
    `/discover/movie?api_key=${process.env.API_KEY}&with_genres=10749`
  );
}

export function fetchDocumentaries() {
  return axios.get(
    `/discover/movie?api_key=${process.env.API_KEY}&with_genres=99`
  );
}
