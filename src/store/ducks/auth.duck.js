import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "../../crud/auth.crud";
import * as routerHelpers from "../../helpers/route";
import { actions as action_profile } from './user_profiles.duck';
import { actions as action_i18n } from './i18n.duck';

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",

  SwitchProfile: "[SwitchProfile] Action",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,

  profile: null,
};

export const reducer = persistReducer(
  { storage, key: "auth", whitelist: ["user", "authToken", "profile"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;

        return { authToken, user: undefined, profile: undefined };
      }

      case actionTypes.SwitchProfile: {
        const { profile } = action.payload;

        return { ...state, profile: profile };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined, profile: undefined };
      }

      case actionTypes.Logout: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;

        return { ...state, user };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } }),

  switchProfile: profile => ({ type: actionTypes.SwitchProfile, payload: { profile } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data: user } = yield getUserByToken().then().catch((err) => console.log(err));
    if(!!user)
      yield put(actions.fulfillUser(user));
    else
      yield put(actions.logout());
  });

  yield takeLatest(actionTypes.UserLoaded, function* userLoaded(action) {
    const { payload: { user } } = action;
    yield put(action_profile.loadAllRequest(user && user.id));
  });

  yield takeLatest(actionTypes.SwitchProfile, function* profileSwitched(action) {
    const { payload: { profile } } = action;
    yield put(action_i18n.setLanguage((profile && profile.lang).toLowerCase()));
  });
}
