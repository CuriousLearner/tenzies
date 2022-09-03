import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };
  const Pip = () => <span className="pip" />;

  const pips = Number.isInteger(props.value)
    ? Array(props.value)
        .fill(0)
        .map((_, i) => <Pip key={i} />)
    : null;
  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
      {/* <h2 className="die-num">{props.value}</h2> */}
      {pips}
    </div>
  );
}
