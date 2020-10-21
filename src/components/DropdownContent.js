import React, { Component, useEffect } from 'react';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { actions } from "src/store/ducks/auth.duck";
import URL from "../helpers/url"
import { ProfileLogoImages } from "../helpers/const"

const linkStyle = {
  textDecoration: 'none', 
  color: 'white', 
  minWidth: 50
}

function dropdownContent(props) {
  const onSelectProfile = (profile) => {
    props.switchProfile(profile);
    setTimeout(() => {
      props.history.push(URL.INDEX())
    }, 500);
  }

  return (
    <div className="dropdownContainer">
      <div className="navigation__container--userLogo" style={{ backgroundImage: `url(${(props.profile && props.profile.logo_url) || ProfileLogoImages[0]})` }}>
        <div className="dropdownContent">
          {props.user_profiles && props.user_profiles.list.map((profile, index) => (
            <div key={profile.id}>
              <img className="dropdownContent--user-logo" src={profile.logo_url || ProfileLogoImages[0]}/>
              <p className="dropdownContent--user-text" onClick={() => onSelectProfile(profile)}>
                {`${profile.name}`}
                {props.profile && props.profile.id === profile.id && "(current)"}
              </p>
            </div>
          ))}
          <Link
              to={URL.MANAGE_PROFILE()}
              className="dropdownContent-text"
              style={linkStyle}
            >
            <p className="dropdownContent-text">Manage Profile</p>
          </Link>
        </div>
        <div className="dropdownContent dropdownContent--2">
          <Link
              to={URL.LOGOUT()}
              className="dropdownContent-text"
              style={linkStyle}
            >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}

export default connect(
  ({ auth: { user, profile }, user_profiles }) => ({ user, profile, user_profiles }),
  {
    ...actions
  }
)(dropdownContent);
