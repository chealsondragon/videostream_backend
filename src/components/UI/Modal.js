import React from 'react';

import Aux from '../../hoc';
import Backdrop from './Backdrop';

export default function Modal(props) {
  const backgroundStyle = {
    backgroundSize: 'cover',
    backgroundImage: props.movie && `url(${props.movie.cover})`
  };

  return (
    <Aux>
      <Backdrop show={props.show} toggleBackdrop={props.modalClosed} />
      <div
        style={backgroundStyle}
        className={props.show ? 'modal show' : 'modal hide'}
      >
        {props.children}
      </div>
    </Aux>
  );
}
