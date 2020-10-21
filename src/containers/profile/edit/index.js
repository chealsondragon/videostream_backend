import React, { Component, useEffect } from 'react';
import _ from 'lodash';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import * as api from "src/crud/user_profiles.crud";
import { actions } from "src/store/ducks/user_profiles.duck";
import { actions as actions_categories } from "src/store/ducks/categories.duck";
import { actions as actions_language } from "src/store/ducks/language.duck";
import { actions as actions_profile_type } from "src/store/ducks/profile_type.duck";

import URL from "../../../helpers/url";
import { ProfileLogoImages } from "src/helpers/const";
import Radio from "src/components/UI/Radio";
import LanguageBox from "src/components/UI/LanguageBox";

import './style.scss';

function EditProfile(props) {
  
  const getRandomizer = (bottom, top) => {
      return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
  }

  const sel_id = _.get(props, 'match.params.id');
  const sel_profile = _.get(props.user_profiles.list.filter(x => x.id === parseInt(sel_id)), '[0]');

  const suggestLogo = React.useMemo(() => ProfileLogoImages[getRandomizer(0, ProfileLogoImages.length-1)], []);
  const inputNameRef = React.useMemo(() => React.createRef(), []);
  
  const [values, setValues] = React.useState({
    selectedType: sel_profile && _.get(props.profile_type.list.filter(x => x.id === sel_profile.user_profile_type_id), '[0]'),
    selectedLang: sel_profile && _.get(props.language.list.filter(x => x.lang_code === sel_profile.lang), '[0]'),
    name: (sel_profile && sel_profile.name) || "",
    nameError: "",
    logo: (sel_profile && sel_profile.logo_url) || suggestLogo,
  });

  const onContinueClick = () => {
    if(!values.name){
      setValues(values => ({ ...values, nameError: "Name is required!" }));
      if(inputNameRef)
        inputNameRef.current.focus();
    }else{
      api.update(sel_id, {
        name: values.name,
        user_profile_type_id: values.selectedType.id,
        logo_url: values.logo,
        lang: values.selectedLang && values.selectedLang.lang_code
      })
        .then((result) => {
          props.update(result.data)
          console.log("Updating profile success!")
          setTimeout(() => {
            props.history.push(URL.SELECT_PROFILE())
          }, 500);
        })
        .catch((error) => {
          console.log("Error in updating profile!")
        })
    }
  }
  const onDeleteClick = () => {
    if(confirm("Are you sure to delete this profile?")){
      api.remove(sel_id)
        .then((result) => {
          props.delete(sel_id)
          console.log("Deleting profile success!")
          setTimeout(() => {
            props.history.push(URL.SELECT_PROFILE())
          }, 500);
        })
        .catch((error) => {
          console.log("Error in deleting profile!")
        })
    }
  }
  const onCancelClick = () => {
    props.history.push(URL.MANAGE_PROFILE())
  }
  const onClickType = (type) => {
    setValues(values => ({ ...values, selectedType: type }));
  }
  const onClickLang = (lang) => {
    setValues(values => ({ ...values, selectedLang: lang }));
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
    props.requestLoadAllLanguage();
  }, []);

  React.useEffect(() => {
    if(!values.selectedType && props.profile_type.list && props.profile_type.list.length > 0){
      setValues(values => ({ ...values, selectedType: _.get(props.profile_type.list, '[0]') }));
    }
  });

  return (
    <div className="edit-container">
      <h1 className="title">Edit Profile</h1>
      <h3 className="tip">Update profile information.</h3>
      <hr/>
      <div key="info" className="information">
        <img src={values.logo}/>
        <div className="input-wrapper">
          <input key="name" ref={inputNameRef} type="text" defaultValue={values.name} placeholder="Name" onChange={evt => onChangeName(evt)} className={values.nameError ? 'error' : ''}/>
          <h4 className="name-error">{values.nameError || ""}</h4>
          <div key="type-group" className="type-group">
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

          <hr/>

          <h3 className="label-lang">Language</h3>
          <div key="lang-group" className="type-group">
            {props.language.list.map((lang, index) => (
              <LanguageBox key={`type-${index}`} checked={values.selectedLang && values.selectedLang.lang_code === lang.lang_code} value={lang} url={process.env.API_BASE_URL+lang.svg_url} name={lang.name} clicked={onClickLang}/>
            ))}
          </div>
        </div>
      </div>
      <hr/>
      <div key="div-done" className="div-done-wrapper">
        <button key="continue" className="btn-continue" onClick={() => onContinueClick()}>SAVE</button>
        <button key="cancel" className="btn-cancel" onClick={() => onCancelClick()}>CANCEL</button>
        <button key="delete" className="btn-delete" onClick={() => onDeleteClick()}>DELETE</button>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(
    ({ auth, user_profiles, profile_type, categories, language }) => ({ auth, user_profiles, profile_type, categories, language }),
    {
      ...actions,
      requestLoadAllProfileTypes: actions_profile_type.loadAllRequest,
      requestLoadAllCategories: actions_categories.loadAllRequest,
      requestLoadAllLanguage: actions_language.loadAllRequest,
    }
  )(EditProfile)
);