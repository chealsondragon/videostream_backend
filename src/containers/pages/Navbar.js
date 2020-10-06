import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import URL from "../../helpers/url"

import axios from '../../axios-movies';
import SearchLogo from '../../static/images/search-icon.svg';
// import NetflixLogo from '../static/images/Netflix_Logo_RGB.png';
import NetflixLogo from '../../static/images/logo.svg';
import BellLogo from '../../static/images/bell-logo.svg';
import DropdownArrow from '../../static/images/drop-down-arrow.svg';
import DropdownContent from "../../components/DropdownContent";

function Navbar(props) {
  const [values, setValues] = React.useState({
    scrolling: false,
    userInput: ''
  });

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);

  /** changes the scrolling state depending on the Y-position */
  const handleScroll = () => {
    if (window.scrollY === 0) {
      setValues(values => ({ ...values, scrolling: false }));
    }
    else if (window.scrollY > 50) {
      setValues(values => ({ ...values, scrolling: true }));
    }
  }

  const onChange = (event) => {
    event.persist()
    setValues(values => ({ ...values, userInput: event.target.value }));
    const userInput = event.target.value

    makeAipCall(userInput);
  }

  /** Make API call as soon as the user starts typing.  */
  const makeAipCall = _.debounce(async (searchItem) => {
    console.log("search: ", searchItem)
    if (searchItem.length === 0) {
      props.history.push(URL.INDEX())
      return
    }
    const url = `/search/multi?api_key=${process.env.API_KEY}&language=en-US&include_adult=false&query=${searchItem}`;
    const response = await axios.get(url);
    const results = response.data.results;
    props.history.push({
      pathname: URL.SEARCH(),
      movies: results,
      userInput: searchItem
    });
  }, 1000);

  const onLogoClick = () => {
    // reset input state
    setValues(values => ({ ...values, userInput: '' }));
  }

  const { scrolling } = values;

  return (
    <nav className={"navigation " + (scrolling ? "black" : "")} >
      <ul className="navigation__container">
        <NavLink to="/" onClick={() => onLogoClick()}>
          <NetflixLogo className="navigation__container--logo"></NetflixLogo>
          {/* <img className="navigation__container--logo" src={NetflixLogo} alt="" /> */}
        </NavLink>
        <DropdownArrow className="navigation__container--downArrow-2"></DropdownArrow>
        <div className="navigation__container-link pseudo-link">Home</div>
        {/* <div className="navigation__container-link pseudo-link">Movies</div>
        <div className="navigation__container-link pseudo-link">Dramas</div> */}
        <div className="navigation__container-link pseudo-link">Pay2Watch</div>
        <div className="navigation__container-link pseudo-link">Recently Added</div>
        <div className="navigation__container-link pseudo-link">My List</div>

        <div className="navigation__container--left">
          <SearchLogo className="logo" />
          <input
            value={values.userInput}
            onChange={onChange}
            className="navigation__container--left__input"
            type="text"
            placeholder="Title, genres, people" />
        </div>

        <div className="navigation__container-link pseudo-link">KIDS</div>
        {/* <div className="navigation__container-link pseudo-link">DVD</div> */}
        <BellLogo className="navigation__container--bellLogo" />

        <DropdownContent />
        <DropdownArrow className="navigation__container--downArrow" />
      </ul>
    </nav>
  )
}

export default withRouter(Navbar); 