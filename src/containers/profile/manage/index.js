import React, { Component, useEffect } from 'react';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { actions } from "src/store/ducks/auth.duck";

import URL from "../../../helpers/url";
import { ProfileLogoImages } from "src/helpers/const";

import styles from './style.scss';

function ManageProfile(props) {
  const onAddProfileClick = () => {
    props.history.push(URL.ADD_PROFILE())
  }
  const onDoneProfileClick = () => {
    props.history.push(URL.SELECT_PROFILE())
  }
  const onEditProfile = (profile) => {
    props.history.push(URL.EDIT_PROFILE({ id: profile && profile.id }))
  }

  const { auth: { profile: current_profile } } = props;

  return (
    <div className="manage-container">
      <h1 className="title">Manage Profiles:</h1>
      <div className="profile-group">
        {props.user_profiles.list.map((profile, index) => (
          <div key={index} className={`profile-block ${current_profile && current_profile.id === profile.id ? 'active' : ''}`} onClick={() => onEditProfile(profile)}>
            <div key="overlay1" className="back-overlay">
            </div>
            <img src={profile.logo_url || ProfileLogoImages[0]}/>
            <span>{profile.name}</span>
            <div key="overlay" className="edit-overlay">
              <img src="../../../static/images/tiny-pencil.png"/>
            </div>
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
      <div key="div-done" className="div-done-wrapper">
        <button key="done-button" onClick={() => onDoneProfileClick()}>DONE</button>
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
  )(ManageProfile)
);