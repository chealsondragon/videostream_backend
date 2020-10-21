import React, { Component, useEffect } from 'react';
import _ from 'lodash';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import * as api from "src/crud/user_profiles.crud";
import { actions } from "src/store/ducks/user_profiles.duck";
import { actions as actions_categories } from "src/store/ducks/categories.duck";
import { actions as actions_profile_type } from "src/store/ducks/profile_type.duck";

import URL from "../../../helpers/url";
import { ProfileLogoImages } from "src/helpers/const";
import Radio from "src/components/UI/Radio";

import './style.scss';

function CreateProfile(props) {
  
  const getRandomizer = (bottom, top) => {
      return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
  }

  const { auth: { profile: current_profile } } = props;
  const suggestLogo = React.useMemo(() => ProfileLogoImages[getRandomizer(0, ProfileLogoImages.length-1)], []);
  const inputNameRef = React.useMemo(() => React.createRef(), []);
  
  const [values, setValues] = React.useState({
    selectedType: null,
    name: "",
    nameError : ""
  });

  console.log(suggestLogo)

  const onContinueClick = () => {
    if(!values.name){
      setValues(values => ({ ...values, nameError: "Name is required!" }));
      if(inputNameRef)
        inputNameRef.current.focus();
    }else{
      console.log("Ready to go!");
      api.create({
        name: values.name,
        user_profile_type_id: values.selectedType.id,
        logo_url: suggestLogo,
      })
        .then((result) => {
          props.create(result.data)
          console.log("Creating profile success!")
          setTimeout(() => {
            props.history.push(URL.SELECT_PROFILE())
          }, 500);
        })
        .catch((error) => {
          console.log("Error in creating profile!")
        })
    }
  }
  const onCancelClick = () => {
    props.history.push(URL.INDEX())
  }
  const onClickType = (type) => {
    setValues(values => ({ ...values, selectedType: type }));
  }
  const onChangeName = (evt) => {
    evt.persist()
    setValues(values => ({ ...values, name: evt.target.value }));
  }

  const getCategoryName = (id) => {
    const category = _.get(
      props.categories.list.filter(x => x.id === id),
      "[0]"
    );

    return ( category && category.name ) || "";
  }
  
  React.useEffect(() => {
    props.requestLoadAllCategories();
    props.requestLoadAllProfileTypes();
  }, []);

  React.useEffect(() => {
    if(!values.selectedType && props.profile_type.list && props.profile_type.list.length > 0){
      setValues(values => ({ ...values, selectedType: _.get(props.profile_type.list, '[0]') }));
    }
  });

  return (
    <div className="create-container">
      <h1 className="title">Add Profile</h1>
      <h3 className="tip">Add a profile for another person watching Videostream.</h3>
      <hr/>
      <div key="info" className="information">
        <img src={suggestLogo}/>
        <div className="input-wrapper">
          <input key="name" ref={inputNameRef} type="text" placeholder="Name" onChange={evt => onChangeName(evt)} className={values.nameError ? 'error' : ''}/>
          <h4 className="name-error">{values.nameError || ""}</h4>
          <div className="type-group">
            {props.profile_type.list.map((type, index) => (
              <Radio key={`type-${index}`} checked={values.selectedType && values.selectedType.id == type.id} value={type} title={`Age: ${type.age_limit || 'None'}+`} name={type.name} clicked={onClickType}/>
            ))}
          </div>
          <h3 className="type-description">{(values.selectedType && values.selectedType.age_limit && `We have age limitation with this type: ${values.selectedType.age_limit}+`) || ""}</h3>
          {values.selectedType && values.selectedType.block_category && values.selectedType.block_category.length > 0 && (
            <h3 className="block-description">Blocked Categories: 
            {values.selectedType.block_category.map((entry, index) =>
              ` ${getCategoryName(entry && entry.category_id)}`
            )}
            </h3>
          )}
        </div>
      </div>
      <hr/>
      <div key="div-done" className="div-done-wrapper">
        <button key="continue" className="btn-continue" onClick={() => onContinueClick()}>CONTINUE</button>
        <button key="cancel" className="btn-cancel" onClick={() => onCancelClick()}>CANCEL</button>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(
    ({ auth, user_profiles, profile_type, categories }) => ({ auth, user_profiles, profile_type, categories }),
    {
      ...actions,
      requestLoadAllProfileTypes: actions_profile_type.loadAllRequest,
      requestLoadAllCategories: actions_categories.loadAllRequest,
    }
  )(CreateProfile)
);