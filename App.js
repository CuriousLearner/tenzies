import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useElapsedTime } from "use-elapsed-time";

export default function App() {
  const [numRolls, setNumRolls] = React.useState(1);
  const [bestNumRolls, setBestNumRolls] = React.useState(
    () => parseInt(localStorage.getItem("bestNumRolls")) || 0
  );
  const [completionTime, setCompletionTime] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(
    () => parseInt(localStorage.getItem("bestTime")) || "-"
  );

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setNumRolls((prevNumRolls) => prevNumRolls + 1);
    } else {
      // Set-up new game with first roll
      setNumRolls(1);
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    if (tenzies) {
      // Game already won, don't allow change in state
      return;
    }
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  React.useEffect(() => {
    if (tenzies) {
      if (bestNumRolls === 0 || numRolls < bestNumRolls) {
        setBestNumRolls(numRolls);
        localStorage.setItem("bestNumRolls", numRolls.toString());
      }
      if (bestTime === "-" || elapsedTime < bestTime) {
        setBestTime(elapsedTime);
        localStorage.setItem("bestTime", elapsedTime);
      }
    }
  }, [tenzies]);

  const { elapsedTime } = useElapsedTime({
    isPlaying: true,
    updateInterval: 1,
    onUpdate: (elapsedTime) => {
      if (!tenzies) setCompletionTime(elapsedTime);
    },
  });

  return (
    <main>
      {tenzies && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <h1 className="title">Tenzies</h1>
      <div className="stats-container">
        <span className="num-rolls">Number of Rolls: </span>
        <span className="num-rolls-value">{numRolls}</span>
        <span className="best-num-rolls">Best number of winning rolls: </span>
        <span className="best-num-rolls-value">{bestNumRolls}</span>

        <span className="elapsed-time">Elapsed Time: </span>
        <span className="elapsed-time-value">
          {tenzies ? completionTime : elapsedTime} seconds
        </span>
        <span className="best-time">Best time: </span>
        <span className="best-time-value">{bestTime} seconds</span>
      </div>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
