import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";

import * as api_fetch from '../crud/moviedb.crud';

import * as api_mylist from '../crud/my_list.crud';
import { actions } from '../store/ducks/my_list.duck';
import { actions as actions_video_player } from '../store/ducks/video_player.duck';

import PlayLogo from '../static/images/play-button.svg';
import RemoveLogo from '../static/images/cancel-music.svg';
import AddLogo from '../static/images/add.svg';

function Header(props) {
  const [movieDetail, setMovieDetail] = React.useState({})

  React.useEffect(() => {
    props.movie && api_fetch.getMovieDetail(props.movie.id)
      .then((res) => {
        setMovieDetail(res.data);
      })

    return () => setMovieDetail({});
  }, [props.movie]);

  const getSerieTypeLabel = () => {
    if(!movieDetail || !movieDetail.serie_type)
      return "";
    let ret = movieDetail.serie_type.name + (movieDetail.depth > 0 ? (': ' + movieDetail.name_step[0] || "") : "");
    for(var i = 1; i < movieDetail.depth; i ++)
      ret += " > " + movieDetail.name_step[i]
    
    return ret;
  }

  const backgroundStyle = {
    backgroundSize: 'cover',
    backgroundImage: props.movie && props.movie.cover && `url(${props.movie.cover})`,
    backgroundPosition: 'center',
  };

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

  var transTitle = {}
  var transDescription = {}
  try{
    transTitle = JSON.parse(props.movie && props.movie.multilang_title)
    transDescription = JSON.parse(props.movie && props.movie.multilang_description)
  }catch(e){
  }

  var lang = (props.lang || "en").toUpperCase();

  return (
    <header style={backgroundStyle} className="header">
      {props.movie && <div className="header__container">
        <h1 className="header__container-heading">{(transTitle && transTitle[lang]) || props.movie.title}</h1>
        {movieDetail && <p className="header__container-serie_type">
          {getSerieTypeLabel()}
        </p>}
        <div className="header__container-categories">
          {movieDetail && movieDetail.categories && movieDetail.categories.map((entry, index) => (
            <span key={index}>{entry.category.name}</span>
          ))}
        </div>
        <div className="header__container-action">
          <button
            onClick={() => console.log('not a movie!')}
            className="header__container-btnPlay"
            onClick={() => startVideo()}
          >
            <PlayLogo className="header__container-btnMyList-play" />
            <FormattedMessage id="MOVIE.PLAY" defaultMessage="Play"/>
          </button>

          {(props.my_list && props.my_list.list.includes(props.movie.id)) ? ( 
          <button className="header__container-btnMyList" onClick={() => doMylist(false)}>
            <RemoveLogo className="header__container-btnMyList-add" />
            <span><FormattedMessage id="MOVIE.REMOVE_FROM_MYLIST" defaultMessage="Remove From My List"/></span>
          </button>) : (
          <button className="header__container-btnMyList" onClick={() => doMylist(true)}>
            <AddLogo className="header__container-btnMyList-add" />
            <span><FormattedMessage id="MOVIE.ADD_TO_MYLIST" defaultMessage="Add to My List"/></span>
          </button>)}
          <img src="../static/images/vote-up.png" className={`header__container-vote__up ${movieDetail.vote === "up" && 'header__container-vote__check'}`} onClick={()=>doVote("up", movieDetail.vote)}></img>
          <img src="../static/images/vote-down.png" className={`header__container-vote__down ${movieDetail.vote === "down" && 'header__container-vote__check'}`} onClick={()=>doVote("down", movieDetail.vote)}></img>
        </div>
        <p className="header__container-overview">{(transDescription && transDescription[lang]) || props.movie.description}</p>
      </div>}
      <div className="header--fadeBottom"></div>
    </header>
  );
}

export default injectIntl(
  connect(
    ({ my_list, i18n: { lang } }) => ({ my_list, lang }),
    {
      ...actions,
      playVideo: actions_video_player.play,
    }
  )(Header)
); 