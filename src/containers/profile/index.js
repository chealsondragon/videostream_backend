import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

import URL from "../../helpers/url"

import SelectProfile from "../profile/select";
import ManageProfile from "../profile/manage";
import AddProfile from "../profile/create";
import EditProfile from "../profile/edit";

export default function HomeProfile() {
  return (
    <Switch>
      <Route path={URL.SELECT_PROFILE()} component={SelectProfile} />
      <Route path={URL.MANAGE_PROFILE()} component={ManageProfile} />
      <Route path={URL.ADD_PROFILE()} component={AddProfile} />
      <Route path={URL.EDIT_PROFILE()} component={EditProfile} />
    </Switch>
  );
}