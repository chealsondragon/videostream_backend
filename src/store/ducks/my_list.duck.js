import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest } from "redux-saga/effects";

export const actionTypes = {
  SetLoading: "[SetLoading-MyList] Action",
  SetActionProgress: "[SetActionProgress-MyList] Action",
  Create: "[Create-MyList] Action",
  Delete: "[Delete-MyList] Action",
  LoadAll: "[LoadAll-MyList] Action",
};

const initialAuthState = {
  list: [],
  isLoading: false,
  isSaving: false
};

export const reducer = persistReducer(
  { storage, key: "my_list" },
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
        const list = state.list || [];
        if(action.payload)
          list.push(parseInt(action.payload));

        return {
          isLoading: false,
          isSaving: false,
          list : list
        };
      }

      case actionTypes.Delete: {
        const { id } = action.payload
        const list = state.list || [];
        const newList = list.filter((x) => x !== parseInt(id));

        return { 
          isLoading: false,
          isSaving: false,
          list: newList 
        };
      }

      case actionTypes.LoadAll: {
        return { 
          isLoading: false,
          isSaving: false,
          list: action.payload
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  create: data => ({ type: actionTypes.Create, payload: data }),
  delete: id => ({ type: actionTypes.Delete, payload: { id } }),
  loadAll: data => ({ type: actionTypes.LoadAll, payload: data }),

  setLoading: loading => ({ type: actionTypes.SetLoading, payload: { loading } }),
  setActionProgress: progress => ({ type: actionTypes.SetActionProgress, payload: { progress } })
};

export function* saga() {
  yield takeLatest(actionTypes.LoadRequest, function* loginSaga() {
  });
}
