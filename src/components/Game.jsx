import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti"; // Import the Confetti component
import Board from "./Board";
import "../styles/Game.css";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], //Rows
    [3, 4, 5], //Rows
    [6, 7, 8], //Rows
    [0, 3, 6], //Columns
    [1, 4, 7], //Columns
    [2, 5, 8], //Columns
    [0, 4, 8], //Diagonals
    [2, 4, 6], //Diagonals
  ];

  for (const [a, b, c] of lines) {
    // Checking if the squares are equal for a winner
    if (squares[a] && squares[a] == squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function computeSquares(currentMoves) {
  const squares = Array(9).fill(null); // Creating an empty array of length 9
  currentMoves.forEach((move) => {
    // Putting the moves played by the players into the array and the squares
    squares[move.square] = move.player; // Move played by a particular player at a particular square
  });
  return squares;
}
const Game = () => {
  const [moves, setMoves] = useState([]); // To keep a track of all the moves played
  const [resetCount, setResetCount] = useState(0); // For incremental reset
  const [winner, setWinner] = useState(null); // To set a winner
  const [celebrate, setCelebrate] = useState(false); // For celebration
  const [nextPlayer, setNextPlayer] = useState("X"); // Track the next player
  const gameContainerRef = useRef(null); // Ref for the game container

  const currentMoves = moves.slice(resetCount); // Only keeps tracks of current moves on the board
  const squares = computeSquares(currentMoves); // Function call to put the current moves on the board
  const gameResult = calculateWinner(squares); // Function call to check if there is a winner

  useEffect(() => {
    if (gameResult) {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [gameResult]);

  const handleClick = (squareIndex) => {
    if (gameResult || squares[squareIndex]) return;

    const newMove = { square: squareIndex, player: nextPlayer };
    const newMoves = [...moves, newMove];
    const newCurrentMoves = newMoves.slice(resetCount);
    const newSquares = computeSquares(newCurrentMoves);
    const newGameResult = calculateWinner(newSquares);

    if (gameResult) {
      setMoves(newMoves);
      setWinner(newGameResult);
      return;
    }

    if (newCurrentMoves.length === 7) {
      let newResetCount = resetCount + 1;
      let updatedCurrentMoves = newMoves.slice(resetCount);
      let updatedNewSquares = computeSquares(updatedCurrentMoves);
      let updatedGameResult = calculateWinner(updatedNewSquares);
      setMoves(newMoves);
      setResetCount(newResetCount);
      setWinner(updatedGameResult);
      setNextPlayer(nextPlayer === "X" ? "O" : "X"); // Preserve the next player's turn
    } else {
      setMoves(newMoves);
      setNextPlayer(nextPlayer === "X" ? "O" : "X"); // Alternate turns
    }
  };

  const handleReset = () => {
    setMoves([]);
    setResetCount(0);
    setWinner(null);
    setCelebrate(false);
    setNextPlayer("X"); // Reset to 'X' when the game is fully reset
  };

  const status = gameResult
    ? `Winner: ${gameResult.winner}`
    : currentMoves.length === 9
    ? "Resetting game..."
    : `Next Player: ${currentMoves.length % 2 === 0 ? "X" : "O"}`;

  return (
    <div className="game" ref={gameContainerRef}>
      {/* Confetti Component */}
      {celebrate && (
        <Confetti
          width={gameContainerRef.current?.clientWidth || window.innerWidth}
          height={gameContainerRef.current?.clientHeight || window.innerHeight}
          recycle={false} // Stop confetti after animation
          numberOfPieces={500} // Number of confetti pieces
          gravity={0.2} // How fast the confetti falls
          wind={0.05} // Slight horizontal movement
        />
      )}

      <div className={`status ${gameResult ? "winner-animation" : ""}`}>
        {status}
      </div>

      <Board squares={squares} onClick={handleClick} />

      <button onClick={handleReset} className="reset">
        Reset Game
      </button>
    </div>
  );
};

export default Game;
