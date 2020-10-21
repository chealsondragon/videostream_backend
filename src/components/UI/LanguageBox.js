import React from 'react';

const styles = {
  checked: {
    display: "flex",
    flexDirection: "column",
    border: "2px solid white",
    borderRadius: "3px",
    padding: "15px",
    cursor: "pointer",
  },
  unchecked: {
    display: "flex",
    flexDirection: "column",
    border: "2px solid transparent",
    bordeRradius: "3px",
    padding: "15px",
    cursor: "pointer",
  },
  img: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
  },
  label: {
    width: "100%",
    textAlign: "center",
    paddingTop: "3px",
    fontSize: "18px",
    color: "white",
  }
};

export default function LanguageBox(props) {
  return (
    <div
      style={props.checked ? styles.checked : styles.unchecked}
      onClick={() => props.clicked(props.value)}
    >
      <img src={props.url}/>
      <span key="name" style={styles.label}>{props.name}</span>
    </div>
  );
}
