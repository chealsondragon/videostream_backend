import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import * as api from "../../crud/user_profiles.crud";

export const actionTypes = {
  SetLoading: "[SetLoading-UserProfile] Action",
  SetActionProgress: "[SetActionProgress-UserProfile] Action",
  Create: "[Create-UserProfile] Action",
  Update: "[Updated-UserProfile] Action",
  Delete: "[Delete-UserProfile] Action",
  Load: "[Load-UserProfile] Action",
  LoadAll: "[LoadAll-UserProfile] Action",

  LoadAllRequest: "[LoadAllRequest-UserProfile] Action",
};

const initialAuthState = {
  list: [],
  isLoading: false,
  isSaving: false
};

export const reducer = persistReducer(
  { storage, key: "user_profiles" },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.SetLoading: {
        const { loading } = action.payload;
        return {
          ...state,
          isLoading: loading
        }
      }
      case actionTypes.SetActionProgress: {
        const { progress } = action.payload;
        return {
          ...state,
          isSaving: progress
        }
      }

      case actionTypes.Create: {
        const { data } = action.payload;
        const list = state.list || [];
        list.push(data);

        return {
          isLoading: false,
          isSaving: false,
          list : list
        };
      }

      case actionTypes.Update: {
        const { data } = action.payload;
        const list = state.list || [];
        const newList = list.map((x) => {
          if (x.id === data.id) return data;
          return x;
        });

        return {
          isLoading: false,
          isSaving: false,
          list : newList
        };
      }

      case actionTypes.Delete: {
        const { id } = action.payload;
        const list = state.list || [];
        const newList = list.filter((x) => x.id !== parseInt(id));

        return { 
          isLoading: false,
          isSaving: false,
          list: newList 
        };
      }

      case actionTypes.LoadAll: {
        const { data } = action.payload;

        return { 
          isLoading: false,
          isSaving: false,
          list: data
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  create: data => ({ type: actionTypes.Create, payload: data }),
  update: data => ({ type: actionTypes.Update, payload: data }),
  delete: id => ({ type: actionTypes.Delete, payload: { id } }),
  loadAll: data => ({ type: actionTypes.LoadAll, payload: data }),

  loadAllRequest: user_id => ({ type: actionTypes.LoadAllRequest, payload: { user_id } }),

  setLoading: loading => ({ type: actionTypes.SetLoading, payload: { loading } }),
  setActionProgress: progress => ({ type: actionTypes.SetActionProgress, payload: { progress } })
};

export function* saga() {
  yield takeLatest(actionTypes.LoadAllRequest, function* requestProfileSaga(action) {
    const { payload: { user_id } } = action;

    yield put(actions.setLoading(true));
    const response = yield api.loadAll(user_id);
    if(response && response.status === 200){
      const { data } = response;
      yield put(actions.loadAll(data));
    }
    yield put(actions.setLoading(false));
  });
}
