import React, { useState } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import ReactNetflixPlayer from 'react-netflix-player';
import { actions } from 'src/store/ducks/video_player.duck';
import * as api from "src/crud/watch.crud";

var prevTimestamp = null;
var totalPlayed = null;
var lastWatchSecond = null;

function VideoPlayer(props) {
  var lang = (props.lang || "en").toLowerCase();
  const { isPlaying, meta } = props.video_player;

  const stopPlaying = () => {
    props.stop();
  }

  const getClipLabel = (video, file) => {
    if(!video || !video.serie_type || !file) return  "";
    if(file.role === 1) return "Trailer";
    if(file.role === 2) return "Intro";
    if(file.role === 3){
      return "Ads at " + getTimeString(file.ads_timepoint || 0);
    }

    const depth = video.serie_type.depth || 0;
    if(depth === 0) return "Movie";
    var label = `${video.serie_type.name_depth1} ${file.no1}`;
    if(depth > 1)
      label += ` ${video.serie_type.name_depth2} ${file.no2}`;
    if(depth > 2)
      label += ` ${video.serie_type.name_depth3} ${file.no3}`;
    if(depth > 3)
      label += ` ${video.serie_type.name_depth4} ${file.no4}`;
    if(depth > 4)
      label += ` ${video.serie_type.name_depth5} ${file.no5}`;

    return label;
  }

  const getClipDuration = (file) => {
    return getTimeString(parseFloat(file && file.duration) || 0)
  }
  
  const getTimeString = (time) => {
    var totalSec = parseFloat(time);
    var min = parseInt(totalSec/60);
    var hr = parseInt(min/60);
    var sec = (totalSec-min*60).toFixed(2);
    min -= hr*60;
  
    return `${hr}h ${min}m ${sec}s`;
  }

  const onTimeUpdate = (evt) => {
    evt.persist(); 
    
    if(!prevTimestamp)
      prevTimestamp = evt.timeStamp;
    if(!totalPlayed)
      totalPlayed = 0.1;
    
    const dur = (evt.timeStamp - prevTimestamp)/1000;
    if(lastWatchSecond < evt.target.currentTime)
      totalPlayed += Math.min(dur, evt.target.currentTime-lastWatchSecond);
    else
      totalPlayed += dur;
    prevTimestamp = evt.timeStamp;
    lastWatchSecond = evt.target.currentTime;
  }

  React.useEffect(() => {
    prevTimestamp = null;
    totalPlayed = null;
    lastWatchSecond = 0;
    // console.log("init seconds...")

    return () => {
      console.log("save watched: ", totalPlayed, lastWatchSecond)
      if(totalPlayed && lastWatchSecond){
        api.update_watch(meta.file.id, totalPlayed, lastWatchSecond)
      }
    }
  })

  return (
    isPlaying && <ReactNetflixPlayer
    // Vídeo Link - Just data is required
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: '100%', zIndex: 0 }}
      src={meta && meta.url}
      // src={"http://videoinvalid"}
      title={`${getClipLabel(meta.video, meta.file)}`}
      subTitle={meta.file.sub_title || ""}
      titleMedia={`${meta.video.title||""} >> ${getClipLabel(meta.video, meta.file)}`}
      extraInfoMedia={""}
      // Text language of player
      playerLanguage={lang}
      // Action when the button X (close) is clicked
      onCrossClick={() => stopPlaying()}
      backButton={() => stopPlaying()}
      // The player use the all viewport
      fullPlayer
      autoPlay
      startPosition={meta.resume_ts || 0}
      // The info of the next video action
      // dataNext={{ title: 'Next Video.' }}
      // The action call when the next video is clicked
      onNextClick={() => {}}
      // The list reproduction data, will be render in this order
      // reprodutionList={[
      //   {
      //     nome: 'Opening',
      //     id: 1,
      //     playing: true,
      //   },
      //   {
      //     nome: 'Teste',
      //     id: 2,
      //     playing: false,
      //   },
      // ]}
      // The function call when a item in reproductionList is clicked
      onClickItemListReproduction={(id, playing) => {
        return {
          id,
          playing,
        };
      }}
      // The function is call when the video finish
      onEnded={() => {}}
      // The function is call when the video is playing (One time for frame)
      onTimeUpdate={(evt) => onTimeUpdate(evt)}
      // Enable the orverlay when player is paused
      overlayEnabled
      // Enabled the auto clode controlls of player
      autoControllCloseEnabled
      // Style
      primaryColor="#03dffc"
      secundaryColor="#ffffff"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"

      // subtitleMedia="/teste.vtt"
    />
  );
}

export default injectIntl(
  connect(
    ({ i18n: { lang }, video_player }) => ({ lang, video_player }),
    actions
  )(VideoPlayer)
); 