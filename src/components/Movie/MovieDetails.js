import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";

import Aux from '../../hoc';

import * as api_fetch from '../../crud/moviedb.crud';
import * as api_mylist from '../../crud/my_list.crud';
import { actions } from '../../store/ducks/my_list.duck';

import RemoveLogo from '../../static/images/cancel-music.svg';
import AddLogo from '../../static/images/add.svg';
import PlayIcon from '../../static/images/play-button.svg';

function MovieDetails(props) {
  const [movieDetail, setMovieDetail] = React.useState({})

  React.useEffect(() => {
    api_fetch.getMovieDetail(props.movie.id)
      .then((res) => {
        setMovieDetail(res.data);
      })
  }, [props.movie]);

  const getSerieTypeLabel = () => {
    if(!movieDetail || !movieDetail.serie_type)
      return "";
    let ret = movieDetail.serie_type.name + (movieDetail.depth > 0 ? (': ' + movieDetail.name_step[0] || "") : "");
    for(var i = 1; i < movieDetail.depth; i ++)
      ret += " > " + movieDetail.name_step[i]
    
    return ret;
  }

  const doVote = (newVote, oldVote) => {
    api_fetch.doVote(props.movie.id, newVote, newVote !== oldVote || !oldVote)
      .then((res) => {
        setMovieDetail(res.data);
      })
  }

  const doMylist = (add) => {
    if(add)
      api_mylist.create(props.movie.id)
        .then((res) => {
          props.create(res.data)
        })
    else
      api_mylist.remove(props.movie.id)
        .then((res) => {
          props.delete(res.data)
        })
  }


  return (
    <Aux>
      <div className="modal__container">
        <h1 className="modal__title">
          {props.movie.title || props.movie.name}
        </h1>
        {movieDetail && <p className="modal__serie_type">
          {getSerieTypeLabel()}
        </p>}
        <p className="modal__info">
          <span className="modal__rating">
            Rating: {((movieDetail && movieDetail.rating) || 0) * 10}%{' '}
          </span>
          Release date: {props.movie.activate_at}{' '}
          Runtime: {props.movie.runtime || props.movie.episode_run_time}m
        </p>
        <p className="modal__episode">
          {props.movie.number_of_episodes
            ? ' Episodes: ' + props.movie.number_of_episodes
            : ''}
          {props.movie.number_of_seasons
            ? ' Seasons: ' + props.movie.number_of_seasons
            : ''}
        </p>
        {movieDetail && <p className="modal__price">
          Price: {(!movieDetail.price_per_hour && !movieDetail.price_to_buy) ? (
            "Free"
          ) : (
            `${movieDetail.price_per_hour}$/hr, ${movieDetail.price_to_buy}$/Total`
          )}<br/><br/>
          Minimum membership: {(movieDetail.condition_plan && movieDetail.condition_plan.name) || "Not required"}<br/>
        </p>}
        <p className="modal__overview">{props.movie.description}</p>
        <div className="modal__action">
          <button className="modal__btn modal__btn--red">
            <PlayIcon className="modal__btn--icon" />
            Play
          </button>

          {(props.my_list && props.my_list.list.includes(props.movie.id)) ? ( 
          <button className="modal__btn" onClick={() => doMylist(false)}>
            <RemoveLogo className="modal__btn--icon" />
            Remove From List
          </button>) : (
          <button className="modal__btn" onClick={() => doMylist(true)}>
            <AddLogo className="modal__btn--icon" />
            My List
          </button>)}
          <img src="../static/images/vote-up.png" className={`modal__vote__up ${movieDetail.vote === "up" && 'modal__vote__check'}`} onClick={()=>doVote("up", movieDetail.vote)}></img>
          <img src="../static/images/vote-down.png" className={`modal__vote__down ${movieDetail.vote === "down" && 'modal__vote__check'}`} onClick={()=>doVote("down", movieDetail.vote)}></img>
        </div>
      </div>
    </Aux>
  );
}

export default injectIntl(
  connect(
    ({ my_list }) => ({ my_list }),
    actions
  )(MovieDetails)
); 