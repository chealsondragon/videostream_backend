import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import URL from "../../helpers/url"

import Dashboard from "./Dashboard";
import Search from "./Search";
import Navbar from "./Navbar";

import LayoutSplashScreen from "../../components/LayoutSplashScreen";

export default function HomePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Navbar/>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to={URL.DASHBOARD()} />
        }
        <Route path={URL.DASHBOARD()} component={Dashboard} />
        <Route path={URL.SEARCH()} component={Search} />

        <Redirect to={URL.NOTFOUND()} />
      </Switch>
    </Suspense>
  );
}
