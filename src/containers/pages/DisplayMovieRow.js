import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function DisplayMovieRow(props) {
  const [values, setValues] = React.useState({
    width: window.innerWidth,
  });

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  const handleResize = (e) => {
    setValues(values => ({ ...values, width: window.innerWidth }));
  };

  const { width } = values;

  const allMovieDict = React.useMemo(() => {
    let ret = {};
    props.videos.list.map((video) => {
      return ret[video.id] = video;
    });
    return ret;
  }, [props.videos]);

  return (
    <>
      <h1 className="movieShowcase__heading">{props.title}</h1>
      <Swiper
        className="movieShowcase__container"
        navigation={true}
        grabCursor={false}
        draggable={false}
        loop={true}
        loopAdditionalSlides={
          width >= 1378 ? 4 :
            width >= 998 ? 3 :
              width >= 625 ? 2 : 2
        }
        breakpoints={{
          1378: {
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
          998: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          625: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
        }}
        preventClicksPropagation={true}
        preventClicks={true}
        scrollbar={{ draggable: false, hide: true }}
        slideToClickedSlide={false}
        pagination={{ clickable: true }}
      >
        {props.movies.map((movie_id, idx) => {
          let movieData = allMovieDict && allMovieDict[movie_id];
          let movieImageUrl = movieData && (props.title !== "Originals" ? movieData.title_logo : movieData.cover);
          if (movieData && movieImageUrl) {
            return (
              <SwiperSlide
                onClick={() => props.selectMovieHandler(movieData)}
                key={idx}
                className={
                  'movieShowcase__container--movie'
                }
              >
                <img
                  src={movieImageUrl}
                  className="movieShowcase__container--movie-image"
                />
              </SwiperSlide>
            );
          }
        })}
      </Swiper>
    </>
  );
}

export default injectIntl(
  connect(
    ({ videos }) => ({ videos }),
    null
  )(DisplayMovieRow)
); 