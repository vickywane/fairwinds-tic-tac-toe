import { useEffect } from "react";
import "../App.css";
import Button from "../components/button";
import Toast from "../components/toast";
import { useGameStore } from "../state/store";

const DisplayGameStatus = ({ gameStatus, currentPlayer, currentWinner }) => (
  <div>
    <p className="title-text">
      {gameStatus === "ONGOING"
        ? `${currentPlayer}'s Turn!`
        : gameStatus === "TIE"
        ? "It is a Tie!"
        : `${currentWinner}'s Wins!`}
    </p>
  </div>
);

const RecordView = ({ gameRecord, currentWinner, handleClick }) => {
  const { wins, losses } = gameRecord;

  return (
    <div className="App">
      <div className="App-container">
        <p className="title-text">
          {" "}
          {currentWinner ? `${currentWinner} WINS` : "IT WAS A tie!"}{" "}
        </p>

        <p className="title-text">
          {" "}
          You have won {wins.length} times <br /> and lost {losses.length} times
        </p>

        <Button clickAction={() => handleClick()} title="Play Again" />
      </div>
    </div>
  );
};

const GameTile = ({ value, handleClick, matchedTile }) => (
  <div
    className="box"
    style={{ background: matchedTile ? "#5CB85C" : "transparent" }}
    onClick={handleClick}
  >
    {value}
  </div>
);

const Game = ({ location }) => {
  const { state } = location;
  const {
    handleTileClick,
    gameTiles,
    isGameDisabled,
    currentPlayer,
    matchedTiles,
    resetGameState,
    currentWinner,
    userGameRecord,
    gameStatus,
    gameView,
    changeGameView,
    setCurrentPlayer,
  } = useGameStore((state) => state);

  useEffect(() => setCurrentPlayer(state?.player), []);

  if (gameView === "IN-RECORD-VIEW") {
    return (
      <RecordView
        gameRecord={userGameRecord}
        currentWinner={currentWinner}
        handleClick={resetGameState}
      />
    );
  }

  return (
    <div className="App">
      <div className="App-container">
        <Toast title="now in game" />
        <DisplayGameStatus {...{ currentPlayer, gameStatus, currentWinner }} />

        <div className="game-boxes">
          {gameTiles.map((tile, index) => (
            <GameTile
              matchedTile={matchedTiles.includes(index)}
              key={index}
              value={tile}
              handleClick={() => handleTileClick(index, state)}
            />
          ))}
        </div>

        {isGameDisabled ? (
          <div className="flex-column">
            <Button title="Play Again" clickAction={() => resetGameState()} />
            <br />
            <Button
              title="See Record"
              clickAction={() => changeGameView("IN-RECORD-VIEW")}
            />
          </div>
        ) : (
          <br />
        )}
      </div>
    </div>
  );
};

export default Game;
