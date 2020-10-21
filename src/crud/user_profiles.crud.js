import axios from "axios";

export const CREATE_URL = "api/admin/user_profile";
export const UPDATE_URL = "api/admin/user_profile/{id}";
export const DELETE_URL = "api/admin/user_profile/{id}";
export const LOAD_URL = "api/admin/user_profile/{id}";
export const LOAD_ALL_URL = "api/admin/user_profile";

export function create(data) {
  return axios.post(CREATE_URL, data);
}

export function update(id, data) {
  return axios.patch(UPDATE_URL.replace("{id}", id), data);
}

export function remove(id) {
  return axios.delete(DELETE_URL.replace("{id}", id));
}

export function load(id) {
  return axios.get(LOAD_URL.replace("{id}", id));
}

export function loadAll(user_id = 0) {
  return axios.get(`${LOAD_ALL_URL}?user_id=${user_id}`);
}