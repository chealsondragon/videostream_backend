import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";

import axios from "axios";
import { setupAxios } from './helpers/utils';
import 'core-js';
import 'regenerator-runtime/runtime';

import App from './containers/App';
import 'swiper/swiper-bundle.min.css';
// import 'swiper/components/navigation/navigation.scss';
// import 'swiper/components/pagination/pagination.scss';
// import 'swiper/components/scrollbar/scrollbar.scss';
// Import main sass file to apply global styles
import './static/sass/style.scss';

const { PUBLIC_URL } = process.env;

setupAxios(axios, store);

const app = (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App
        store={store}
        persistor={persistor}
        basename={PUBLIC_URL}
      />
    </PersistGate>
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));

console.log(process.env.API_BASE_URL)