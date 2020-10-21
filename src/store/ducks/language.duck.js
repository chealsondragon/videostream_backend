import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import * as api from "../../crud/language.crud";

export const actionTypes = {
SetLoading: "[SetLoading-Language] Action",
  SetActionProgress: "[SetActionProgress-Language] Action",
  Create: "[Create-Language] Action",
  Update: "[Updated-Language] Action",
  Delete: "[Delete-Language] Action",
  Load: "[Load-Language] Action",
  LoadAll: "[LoadAll-Language] Action",
  LoadRequest: "[LoadRequest-Language] Action",

  LoadAllRequest: "[LoadAllRequest-Language] Action",
};

const initialAuthState = {
  list: [],
  isLoading: false,
  isSaving: false
};

export const reducer = persistReducer(
  { storage, key: "language" },
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
        const newList = list.filter((x) => x.id !== id);
        console.log(newList)

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
  loadRequest: () => ({ type: actionTypes.LoadRequest, payload: null }),

  setLoading: loading => ({ type: actionTypes.SetLoading, payload: { loading } }),
  setActionProgress: progress => ({ type: actionTypes.SetActionProgress, payload: { progress } }),
  
  loadAllRequest: () => ({ type: actionTypes.LoadAllRequest, payload: null }),
};

export function* saga() {
  yield takeLatest(actionTypes.LoadAllRequest, function* requestAllLanguage() {
    yield put(actions.setLoading(true));
    const response = yield api.loadAll();
    if(response && response.status === 200){
      const { data } = response;
      yield put(actions.loadAll(data));
    }
    yield put(actions.setLoading(false));
  });
}
