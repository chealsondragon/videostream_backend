import React from 'react';

import Header from '../../components/Landing/Header/Header.jsx';
import Features from '../../components/Landing/Features/Features.jsx';
import Footer from '../../components/Landing/Footer/Footer.jsx';

import { Link, Redirect, Route, Switch } from "react-router-dom";
import Registration from "../auth/Registration";
import ForgotPassword from "../auth/ForgotPassword";
import Login from "../auth/Login";

import URL from "../../helpers/url";

export default function Landing(){
  return (
    <div className="App">
      <Header/>
      <Features />
      <Footer />
      <Switch>
        <Route path={URL.LOGIN()} component={Login} />
        <Route path={URL.REGISTER()} component={Registration} />
        {/* <Route
          path={URL.FORGOT_PASSWORD()}
          component={ForgotPassword}
        /> */}
        <Redirect from={URL.AUTH()} exact={true} to={URL.LOGIN()} />
      </Switch>
    </div>
  );
}