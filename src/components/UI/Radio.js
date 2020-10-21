import React from 'react';

const styles = {
  checked: {
    backgroundColor: "white",
    color: "black",
    border: "0px solid black",
    fontSize: "24px",
    padding: ".2em",
    maxWidth: "12em",
    textAlign: "center",
    cursor: "pointer",
    padding: ".5em",
    marginTop: "1em",
    marginRight: "1em",
    minWidth: "6em",
  },
  unchecked: {
    backgroundColor: "black",
    color: "white",
    border: "2px solid white",
    fontSize: "24px",
    padding: ".2em",
    maxWidth: "12em",
    textAlign: "center",
    cursor: "pointer",
    padding: ".5em",
    marginTop: "1em",
    marginRight: "1em",
    minWidth: "6em",
  },
};

export default function Radio(props) {
  return (
    <div
      style={props.checked ? styles.checked : styles.unchecked}
      onClick={() => props.clicked(props.value)}
    >
      {props.checked && <span key="check">✓</span>}
      <span key="name">{props.name}</span>
    </div>
  );
}
