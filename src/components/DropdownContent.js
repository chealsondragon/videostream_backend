import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import URL from "../helpers/url"

const linkStyle = {
  textDecoration: 'none', 
  color: 'white', 
  minWidth: 50
}

function dropdownContent(props) {
  return (
    <div className="dropdownContainer">
      <div className="navigation__container--userLogo">
        <div className="dropdownContent">
          {props.user && props.user.profiles && props.user.profiles.map((profile) => (
            <div key={profile.id}>
              <div className="dropdownContent--user"></div>
              <p className="dropdownContent--user-text">{`${profile.name} (${profile.type && profile.type.name})`}</p>
            </div>
          ))}
          <Link
              to={URL.PROFILE()}
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
  ({ auth: { user } }) => ({ user }),
  null
)(dropdownContent);
