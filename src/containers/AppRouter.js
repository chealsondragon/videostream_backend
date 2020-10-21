import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import * as routerHelpers from "../helpers/route";

import I18nProvider from '../i18n/i18nProvider';
import HomePage from './pages/HomePage';

import Landing from "./landing/index";
import AuthPage from "./auth/AuthPage";
import LogoutPage from "./auth/Logout";

import URL from "../helpers/url"

const AppRouter = () => {
  const lastLocation = useLastLocation();
  routerHelpers.saveLastLocation(lastLocation);
  const { isAuthorized, userLastLocation } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
      userLastLocation: routerHelpers.getLastLocation()
    }),
    shallowEqual
  );

  console.log(isAuthorized, userLastLocation);

  return (
    <I18nProvider>
      <BrowserRouter>
        <Switch>
          {!isAuthorized ? (
            /* Render auth page when user at `/auth` and not authorized. */
            <>
              <Route path={URL.INDEX()} component={Landing} />
            </>
          ) : (
              /* Otherwise redirect to root page (`/`) */
              <Redirect from={URL.AUTH()} to={userLastLocation} />
            )}

          <Route path={URL.LOGOUT()} component={LogoutPage} />

          {isAuthorized && <HomePage userLastLocation={userLastLocation} /> }

        </Switch>
      </BrowserRouter>
    </I18nProvider>
  );
}

export default AppRouter;
