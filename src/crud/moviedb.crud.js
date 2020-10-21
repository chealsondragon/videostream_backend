import axios from 'axios';

export const FETCH_TRENDING = 'FETCH_TRENDING';
export const FETCH_NETFLIX_ORIGINALS = 'FETCH_NETFLIX_ORIGINALS';
export const FETCH_TOP_RATED = 'FETCH_TOP_RATED';
export const FETCH_ACTION_MOVIES = 'FETCH_ACTION_MOVIES';
export const FETCH_COMEDY_MOVIES = 'FETCH_COMEDY_MOVIES';
export const FETCH_HORROR_MOVIES = 'FETCH_HORROR_MOVIES';
export const FETCH_ROMANCE_MOVIES = 'FETCH_ROMANCE_MOVIES';
export const FETCH_DOCUMENTARIES = 'FETCH_DOCUMENTARIES';

export const SEARCH_MOVIE_SUMMARY_URL = '/api/frontend/search/summary';
export const SEARCH_MOVIE_CATEGORY_URL = '/api/frontend/search/category';
export const SEARCH_MOVIE_BYNAME_URL = '/api/frontend/search';
export const SEARCH_MOVIE_BYTAG_URL = '/api/frontend/search';
export const DETAIL_MOVIE_URL = '/api/frontend/movie_detail';
export const VOTE_MOVIE_URL = '/api/frontend/vote_movie';

export function fetchBySummary() {
  return axios.get(`${SEARCH_MOVIE_SUMMARY_URL}`); // trending + originals + top
}

export function fetchByCategories() {
  return axios.get(`${SEARCH_MOVIE_CATEGORY_URL}`);
}

export function fetchbyName(name = '') {
  return axios.get(`${SEARCH_MOVIE_BYNAME_URL}?name=${name}`); // by name
}

export function fetchByTag(tag = ''){
  return axios.get(`${SEARCH_MOVIE_BYTAG_URL}?tag=${tag}`); // by tag
}

export function getMovieDetail(movie_id){
  return axios.get(`${DETAIL_MOVIE_URL}/${movie_id}`); // by tag
}

export function doVote(movie_id, newVote, addOrRemove){
  return axios.get(`${VOTE_MOVIE_URL}/${movie_id}/${newVote}/${addOrRemove?1:0}`); // by tag
}