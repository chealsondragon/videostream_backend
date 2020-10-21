import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
  StartPlaying: "[StartPlaying-VideoPlayer] Action",
  StopPlaying: "[StopPlaying-VideoPlayer] Action",
};

const initialAuthState = {
  meta : {},
  isPlaying : false
};

export const reducer = persistReducer(
  { storage, key: "video_player" },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.StartPlaying: {
        const meta = action.payload || {};
        return {
          ...state,
          meta: meta,
          isPlaying: true
        }
      }
      case actionTypes.StopPlaying: {
        return {
          meta: null,
          isPlaying: false
        }
      }

      default:
        return state;
    }
  }
);

export const actions = {
  play: meta => ({ type: actionTypes.StartPlaying, payload: meta }),
  stop: () => ({ type: actionTypes.StopPlaying }),
};

export function* saga() {
}
