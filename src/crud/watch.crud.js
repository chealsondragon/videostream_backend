import axios from "axios";

export const UPDATE_WATCH = "api/frontend/watch/{clip_id}/{duration}/{current_timestamp}";

export function update_watch(clip_id, duration, current_timestamp) {
  return axios.post(UPDATE_WATCH
                  .replace("{clip_id}", clip_id)
                  .replace("{duration}", duration)
                  .replace("{current_timestamp}", current_timestamp));
}