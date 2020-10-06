import axios from "axios";

export const CREATE_URL = "api/frontend/mylist/{movie_id}";
export const DELETE_URL = "api/frontend/mylist/{movie_id}";
export const LOAD_ALL_URL = "api/frontend/mylist";

export function create(movie_id) {
  return axios.post(CREATE_URL.replace("{movie_id}", movie_id));
}

export function remove(movie_id) {
  return axios.delete(CREATE_URL.replace("{movie_id}", movie_id));
}

export function loadAll() {
  return axios.get(LOAD_ALL_URL);
}