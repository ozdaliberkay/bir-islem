import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [size, setSize] = useState(null);
  const [grid, setGrid] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [lastPos, setLastPos] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = (s) => {
    setSize(s);
    setGrid(Array(s).fill().map(() => Array(s).fill(null)));
    setCurrentNumber(1);
    setLastPos(null);
    setGameOver(false);
  };

  const isValidMove = (r, c) => {
    if (grid[r][c] !== null) return false;
    if (lastPos === null) return true;

    const dr = Math.abs(r - lastPos.r);
    const dc = Math.abs(c - lastPos.c);

    return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
  };

  const hasValidMoves = () => {
    if (lastPos === null) return true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isValidMove(r, c)) return true;
      }
    }
    return false;
  };

  const handleClick = (r, c) => {
    if (!isValidMove(r, c)) return;

    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = currentNumber;

    setGrid(newGrid);
    setLastPos({ r, c });
    setCurrentNumber(currentNumber + 1);
  };

  useEffect(() => {
    if (size && currentNumber > 1 && !hasValidMoves()) {
      setGameOver(true);
    }
  }, [grid, lastPos, size, currentNumber]);

  if (!size) {
    return (
      <div className="menu-container">
        <h1>Sayı Yerleştirme Oyunu</h1>
        <p>Satrançtaki At (L harfi) hamlesi kurallarıyla oynanır.<br />Başlamak için tablo boyutunu seçin:</p>
        <div className="size-buttons">
          {[5, 6, 7, 8, 9].map((s) => (
            <button key={s} onClick={() => initializeGame(s)}>
              {s}x{s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="header">
        <h1>{size}x{size} Sayı Yerleştirme</h1>
        <p>Sıradaki Sayı: <strong>{currentNumber}</strong></p>
        {gameOver && (
          <div className="game-over">
            {currentNumber > size * size ? "Tebrikler, Kazandınız!" : "Oyun Bitti! Gidecek yer kalmadı."}
          </div>
        )}
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isValid = isValidMove(r, c);
            const isLast = lastPos?.r === r && lastPos?.c === c;
            const showPink = lastPos !== null && isValid;

            let className = "cell";
            if (cell !== null) className += " filled";
            if (isLast) className += " last-played";
            if (showPink) className += " valid";

            return (
              <div
                key={`${r}-${c}`}
                className={className}
                onClick={() => handleClick(r, c)}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>

      <button className="reset-btn" onClick={() => setSize(null)}>
        Menüye Dön
      </button>
    </div>
  );
}

export default App;
