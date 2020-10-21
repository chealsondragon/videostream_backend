import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

import URL from "../../helpers/url"

import Dashboard from "./Dashboard";
import Search from "./Search";
import Navbar from "./Navbar";

import Profiles from "../profile";

import LayoutSplashScreen from "../../components/LayoutSplashScreen";
import VideoPlayer from "../../components/VideoPlayer";

export default function HomePage() {
  const { selectedProfile } = useSelector(
    ({ auth }) => ({
      selectedProfile: auth && auth.profile
    }),
    shallowEqual
  );

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Navbar profile={selectedProfile}/>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to={selectedProfile ? URL.DASHBOARD() : URL.SELECT_PROFILE()} />
        }

        <Route path={URL.PROFILE()} component={Profiles} />

        {selectedProfile && 
        <>
          <Route path={URL.DASHBOARD()} component={Dashboard} />
          <Route path={URL.SEARCH()} component={Search} />

          <Route path={URL.PAY2WATCH()} component={Search} />
          <Route path={URL.RECENT()} component={Search} />
          <Route path={URL.MYLIST()} component={Search} />

        </>
        }
        <Redirect to={URL.NOTFOUND()} />
      </Switch>
      <VideoPlayer/>
    </Suspense>
  );
}
