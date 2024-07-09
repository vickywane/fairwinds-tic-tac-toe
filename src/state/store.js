import { create } from "zustand";
import { findUniqueRandomNumber, getWinner } from "../utils";

export const useGameStore = create((set) => ({
  userGameRecord: {
    wins: [],
    losses: [],
  },
  matchedTiles: [],
  isGameDisabled: false,
  currentWinner: undefined,
  gameStatus: "ONGOING",
  gameTiles: new Array(9).fill(null),
  currentPlayer: null,
  gameView: "IN-GAME-VIEW",

  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  changeGameStatus: (status) => set({ gameStatus: status }),
  setGameRecord: (record) => set({ userGameRecord: record }),
  setGameTiles: (tiles) => set({ gameTiles: tiles }),
  disableGame: (status) => set({ isGameDisabled: status }),
  setWinner: (winner) => set({ currentWinner: winner }),
  setMatchedTiles: (tiles) => set({ matchedTiles: tiles }),
  changeGameView: (view) => set({ gameView: view }),

  handleTileClick: (position, state) => {
    const {
      gameTiles,
      isGameDisabled,
      setWinner,
      setGameTiles,
      processGameRecord,
      changeGameStatus,
      disableGame,
      setCurrentPlayer,
      setMatchedTiles,
    } = useGameStore.getState();

    if (!gameTiles[position] && !isGameDisabled) {
      let tilesCopy = [...gameTiles];

      if (!tilesCopy.includes(null)) {
        changeGameStatus("TIE");
        disableGame(true);
        return;
      }

      // user move
      tilesCopy[position] = state.player;

      // computer move
      const opponentPlayer = state.player === "X" ? "O" : "X";
      setCurrentPlayer(opponentPlayer);

      // Simulating computer move
      setTimeout(() => {
        tilesCopy[findUniqueRandomNumber(tilesCopy)] = opponentPlayer;
        const gameResult = getWinner(tilesCopy);

        if (gameResult?.winningPlayer) {
          disableGame(true);
          setMatchedTiles(gameResult?.matchingTiles);
          setWinner(gameResult?.winningPlayer);
          changeGameStatus("WIN");

          if (gameResult?.winningPlayer === state.player) {
            // setGameRecord({ wins: gameResult?.winningPlayer });
            processGameRecord({ wins: gameResult?.winningPlayer });
            
          } else {
            // setGameRecord({ loss: state.player });

            processGameRecord({ loss: gameResult?.winningPlayer });
          }
        }

        // return back to user
        setCurrentPlayer(state.player);
        setGameTiles(tilesCopy);
      }, 500);
    } else if (!gameTiles.includes(null)) {
      changeGameStatus("TIE");
      disableGame(true);
    }
  },

  resetGameState: () => {
    const {
      setGameTiles,
      setMatchedTiles,
      disableGame,
      setGameStatus,
      changeGameView
    } = useGameStore.getState();

    setGameTiles(new Array(9).fill(null));
    disableGame(false);
    setMatchedTiles([]);
    changeGameView("IN-GAME-VIEW");
    setGameStatus("ONGOING");
  },

  processGameRecord: ({ wins, loss }) => {
    const { userGameRecord, setGameRecord } = useGameStore.getState();

    let gameLosses = [...userGameRecord.losses];
    let gameWins = [...userGameRecord.wins];

    if (wins) {
      gameWins.push(wins);
    }

    if (loss) {
      gameLosses.push(loss);
    }

    setGameRecord({
      wins: gameWins,
      losses: gameLosses,
    });
  },
}));
