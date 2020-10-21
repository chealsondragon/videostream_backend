import React, { Component, useEffect } from 'react';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { actions } from "src/store/ducks/auth.duck";

import URL from "../../../helpers/url";
import { ProfileLogoImages } from "src/helpers/const";

import styles from './style.scss';

function SelectProfile(props) {
  const onAddProfileClick = () => {
    props.history.push(URL.ADD_PROFILE())
  }
  const onManageProfileClick = () => {
    props.history.push(URL.MANAGE_PROFILE())
  }
  const onSelectProfile = (profile) => {
    props.switchProfile(profile);
    setTimeout(() => {
      props.history.push(URL.INDEX())
    }, 500);
  }

  const { auth: { profile: current_profile } } = props;

  return (
    <div className="select-container">
      <h1 className="title">Who's watching?</h1>
      <div className="profile-group">
        {props.user_profiles.list.map((profile, index) => (
          <div key={index} className={`profile-block ${current_profile && current_profile.id === profile.id ? 'active' : ''}`} onClick={() => onSelectProfile(profile)}>
            <img src={profile.logo_url || ProfileLogoImages[0]}/>
            <span>{profile.name}</span>
          </div>
        ))}
        <div key='add-profile' className="profile-block" onClick={() => onAddProfileClick()}>
          <div className="add-profile">
            <div className="circle">
              <span>+</span>
            </div>
          </div>
          <span>Add Profile</span>
        </div>
      </div>
      <div key="div-done" className="div-done-wrapper-select">
        <button key="done-button" onClick={() => onManageProfileClick()}>MANAGE PROFILES</button>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(
    ({ auth, user_profiles }) => ({ auth, user_profiles }),
    {
      ...actions
    }
  )(SelectProfile)
);