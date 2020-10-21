import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import * as report from "./ducks/report.duck";

import * as i18n from "./ducks/i18n.duck";

import * as language from "./ducks/language.duck";
import * as plan from "./ducks/plan.duck";
import * as profile_type from "./ducks/profile_type.duck";
import * as serie_type from "./ducks/serie_type.duck";

import * as users from "./ducks/users.duck";
import * as user_profiles from "./ducks/user_profiles.duck";

import * as categories from "./ducks/categories.duck";
import * as videos from "./ducks/videos.duck";
import * as my_list from "./ducks/my_list.duck";
import * as video_files from "./ducks/video-files.duck";

import * as video_player from "./ducks/video_player.duck";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  report: report.reducer,

  users: users.reducer,
  user_profiles: user_profiles.reducer,

  language: language.reducer,
  plan: plan.reducer,
  profile_type: profile_type.reducer,
  serie_type: serie_type.reducer,

  categories: categories.reducer,
  videos: videos.reducer,
  video_files: video_files.reducer,

  my_list: my_list.reducer,
  video_player: video_player.reducer,

  i18n: i18n.reducer,
});

export function* rootSaga() {
  yield all([
    auth.saga(), 
    users.saga(),
    user_profiles.saga(),
    profile_type.saga(),
    categories.saga(),
    language.saga(),
  ]);
}
