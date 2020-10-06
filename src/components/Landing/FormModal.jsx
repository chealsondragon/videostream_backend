import React from 'react';
import { withRouter } from 'react-router-dom';

import Aux from '../../hoc';
import Backdrop from '../UI/Backdrop';

import URL from '../../helpers/url';

function Modal(props) {
  const backgroundStyle = {
    width: 400,
    height: 'auto',
    padding: 50,
    marginLeft: '40%',
    textAlign: 'center',
    backgroundColor: 'black',
    fontSize: 16,
    borderRadius: 3,
    transition: '.5s .3s ease-out',
    opacity: 0.9,
  };

  return (
    <Aux>
      <Backdrop show={props.show} toggleBackdrop={() => props.history.push(URL.INDEX())} />
      <div
        style={backgroundStyle}
        className={props.show ? 'modal show' : 'modal hide'}
      >
        {props.children}
      </div>
    </Aux>
  );
}

export default withRouter(Modal);