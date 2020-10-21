import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";

import Aux from '../../hoc';

import * as api_fetch from '../../crud/moviedb.crud';
import * as api_mylist from '../../crud/my_list.crud';
import { actions } from '../../store/ducks/my_list.duck';
import { actions as actions_video_player } from '../../store/ducks/video_player.duck';

import RemoveLogo from '../../static/images/cancel-music.svg';
import AddLogo from '../../static/images/add.svg';
import PlayIcon from '../../static/images/play-button.svg';

function MovieDetails(props) {
  const videoBackgroundRef = React.createRef();
  const [movieDetail, setMovieDetail] = React.useState({})

  var lang = (props.lang || "en").toUpperCase();
  var intro_vid_url = "";
  if(movieDetail && movieDetail.series_aux && movieDetail.series_aux.intro && movieDetail.series_aux.intro.length){
    const intro_vid = _.get(
      movieDetail.series_aux.intro.filter(x => x.lang && x.lang.lang_code === lang),
      '[0]'
    );
    intro_vid_url = (intro_vid && `${movieDetail.referer}${intro_vid.file_path}`) || "";
  }

  var transTitle = {}
  var transDescription = {}
  try{
    transTitle = JSON.parse(props.movie && props.movie.multilang_title)
    transDescription = JSON.parse(props.movie && props.movie.multilang_description)
  }catch(e){
  }

  React.useEffect(() => {
    videoBackgroundRef.current.src = intro_vid_url;
    videoBackgroundRef.current.play();
    return () => {
      if(videoBackgroundRef.current)
        videoBackgroundRef.current.pause();
    }
  }, [intro_vid_url]);

  React.useEffect(() => {
    if(props.movie && props.movie.id){
      api_fetch.getMovieDetail(props.movie.id)
        .then((res) => {
          setMovieDetail(res.data);
        })
    }
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

  const makeSerieNumberString = (depth, namesStep, clip) => {
    if(depth === 0) return "Single clip";
    var ret = `${namesStep[0]||""}-${clip.no1||""}`;
    if(depth <= 1)  return ret;
    ret += ` ${namesStep[1]||""}-${clip.no2||""}`;
    if(depth <= 2)  return ret;
    ret += ` ${namesStep[2]||""}-${clip.no3||""}`;
    if(depth <= 3)  return ret;
    ret += ` ${namesStep[3]||""}-${clip.no4||""}`;
    if(depth <= 4)  return ret;
    ret += ` ${namesStep[4]||""}-${clip.no5||""}`;
    return ret;
  }

  const startVideo = (clip) => {
    if(!clip){
      if(movieDetail.series_line.length <= 0){
        console.log("No clips")
        return;
      }
      clip = movieDetail.series_line[0]
    }
    props.playVideo({ video: props.movie, detail: movieDetail, file: clip, url: `${movieDetail.referer}${clip.file_path}`, title: (transTitle && transTitle[lang]) || props.movie.title })
  }

  return (
    <Aux>
      {props.movie && <div className="modal__container">
        <div className="modal__info_container">
          <h1 className="modal__title">
            {(transTitle && transTitle[lang]) || props.movie.title}
          </h1>
          {movieDetail && <p className="modal__serie_type">
            {getSerieTypeLabel()}
          </p>}
          <div className="modal__categories">
            {movieDetail && movieDetail.categories && movieDetail.categories.map((entry, index) => (
              <span key={index}>{entry.category.name}</span>
            ))}
          </div>
          <p className="modal__info">
            <span className="modal__rating">
              <FormattedMessage id="MOVIE.RATING" defaultMessage="Rating"/>: {((movieDetail && movieDetail.rating) || 0) * 10}%{' '}
            </span>
            <FormattedMessage id="MOVIE.RELEASE_DATE" defaultMessage="Release Date"/>: {props.movie.activate_at}{' '}
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
            <FormattedMessage id="MOVIE.PRICE" defaultMessage="Price"/>: {(!movieDetail.price_per_hour && !movieDetail.price_to_buy) ? (
              "Free"
            ) : (
              `${movieDetail.price_per_hour}$/hr, ${movieDetail.price_to_buy}$/Total`
            )}<br/><br/>
            <FormattedMessage id="MOVIE.MEMBERSHIP" defaultMessage="Minimum Membership"/>: {(movieDetail.condition_plan && movieDetail.condition_plan.name) || "Not required"}<br/>
          </p>}
          <p className="modal__overview">{(transDescription && transDescription[lang]) || props.movie.description}</p>
          <div className="modal__action">
            <button className="modal__btn modal__btn--red" onClick={() => startVideo()}>
              <PlayIcon className="modal__btn--icon"/>
              <FormattedMessage id="MOVIE.PLAY" defaultMessage="Play"/>
            </button>

            {(props.my_list && props.my_list.list.includes(props.movie.id)) ? ( 
            <button className="modal__btn" onClick={() => doMylist(false)}>
              <RemoveLogo className="modal__btn--icon" />
              <span><FormattedMessage id="MOVIE.REMOVE_FROM_MYLIST" defaultMessage="Remove From My List"/></span>
            </button>) : (
            <button className="modal__btn" onClick={() => doMylist(true)}>
              <AddLogo className="modal__btn--icon" />
              <span><FormattedMessage id="MOVIE.ADD_TO_MYLIST" defaultMessage="Add to My List"/></span>
            </button>)}
            <img src="../static/images/vote-up.png" className={`modal__vote__up ${movieDetail.vote === "up" && 'modal__vote__check'}`} onClick={()=>doVote("up", movieDetail.vote)}></img>
            <img src="../static/images/vote-down.png" className={`modal__vote__down ${movieDetail.vote === "down" && 'modal__vote__check'}`} onClick={()=>doVote("down", movieDetail.vote)}></img>
          </div>
        </div>
        <div className="modal__file_container">
          <ul className="modal__list_file">
            {movieDetail && movieDetail.series_line && movieDetail.series_line.map((clip, index) => (
              clip.lang && clip.lang.lang_code === lang && <li key={index} onClick={() => startVideo(clip)}>
                <div className="episode-wrapper">
                  <PlayIcon className="btn-play-episode"/>
                  <img src={`${movieDetail.referer}${clip.logo_path1 || clip.logo_path_upload}`}/>
                  <div className="titles-episode">
                    <h4>{makeSerieNumberString(movieDetail.depth, movieDetail.name_step, clip)}</h4>
                    <span>{clip.sub_title || "Subtitle goes here..."}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>}
      <video muted loop className="modal__background" ref={videoBackgroundRef}>
        <source type="video/mp4"/>
      </video>
    </Aux>
  );
}

export default injectIntl(
  connect(
    ({ my_list, i18n: { lang }, video_player }) => ({ my_list, lang, video_player }),
    {
      ...actions,
      playVideo: actions_video_player.play,
    }
  )(MovieDetails)
); 