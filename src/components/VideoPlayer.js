import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import ReactNetflixPlayer from 'react-netflix-player';

function VideoPlayer(props) {
  const id = props.video_id;
  const main_video = props.video;
  
  const [values, setValues] = React.useState({
    playingVideo: false,
    playingVideoFile: null,
  });

  React.useEffect(() => {
  }, []);

  const playVideo = (file) => {
    setValues({...values, playingVideo: true, playingVideoFile: file});
  }

  const stopPlaying = () => {
    setValues({...values, playingVideo: false, playingVideoFile: null});
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

  const serie_type = main_video && main_video.serie_type;

  return (
    values.playingVideo && values.playingVideoFile && <ReactNetflixPlayer
    // Vídeo Link - Just data is required
      src={`${process.env.API_BASE_URL || document.location.origin}/storage/videos/${values.playingVideoFile.file_path}`}
      // src={"http://videoinvalid"}
      title={getClipLabel(main_video, values.playingVideoFile)}
      subTitle={values.playingVideoFile.sub_title}
      titleMedia={getClipLabel(main_video, values.playingVideoFile)}
      extraInfoMedia={values.playingVideoFile.sub_title}
      // Text language of player
      playerLanguage="en"
      // Action when the button X (close) is clicked
      onCrossClick={() => stopPlaying()}
      backButton={() => stopPlaying()}
      // The player use the all viewport
      fullPlayer
      autoPlay
      startPosition={0}
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
      onEnded={() => stopPlaying()}
      // The function is call when the video is playing (One time for frame)
      onTimeUpdate={(evt) => {evt.persist(); console.log("playing:", evt)}}
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
    ({  }) => ({  }),
    null
  )(VideoPlayer)
); 