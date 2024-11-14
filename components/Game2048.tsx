"use client";

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameTile from './GameTile';
import GameOverScreen from './GameOverScreen';

type Tile = {
  value: number;
  id: string;
  position: [number, number];
  mergedFrom?: boolean;
};

const GRID_SIZE = 4;
const CELL_SIZE = 10;
const CELL_GAP = 2;

export default function Game2048() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initializeGame = () => {
    const initialTiles = [];
    for (let i = 0; i < 2; i++) {
      initialTiles.push(addRandomTile([]));
    }
    setTiles(initialTiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const addRandomTile = (currentTiles: Tile[]): Tile => {
    const emptyCells = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!currentTiles.some(tile => tile.position[0] === x && tile.position[1] === y)) {
          emptyCells.push([x, y]);
        }
      }
    }
    
    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return {
      value: Math.random() < 0.9 ? 2 : 4,
      id: `${Date.now()}-${x}-${y}`,
      position: [x, y],
    };
  };

  const moveTiles = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    const vector = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    }[direction];

    const newTiles = [...tiles].sort((a, b) => {
      if (direction === 'up') return a.position[0] - b.position[0];
      if (direction === 'down') return b.position[0] - a.position[0];
      if (direction === 'left') return a.position[1] - b.position[1];
      if (direction === 'right') return b.position[1] - a.position[1];
      return 0;
    });

    let moved = false;
    let newScore = score;
    const mergedPositions: string[] = [];

    newTiles.forEach(tile => {
      let [row, col] = tile.position;
      let newRow = row;
      let newCol = col;

      while (true) {
        const nextRow = newRow + vector[0];
        const nextCol = newCol + vector[1];

        if (nextRow < 0 || nextRow >= GRID_SIZE || nextCol < 0 || nextCol >= GRID_SIZE) break;

        const targetTile = newTiles.find(t => 
          t.position[0] === nextRow && 
          t.position[1] === nextCol && 
          !mergedPositions.includes(`${nextRow},${nextCol}`)
        );

        if (!targetTile) {
          newRow = nextRow;
          newCol = nextCol;
          moved = true;
        } else if (targetTile.value === tile.value) {
          newRow = nextRow;
          newCol = nextCol;
          tile.value *= 2;
          newScore += tile.value;
          mergedPositions.push(`${newRow},${newCol}`);
          const targetIndex = newTiles.indexOf(targetTile);
          newTiles.splice(targetIndex, 1);
          moved = true;
          if (tile.value === 2048 && !won) setWon(true);
          break;
        } else {
          break;
        }
      }

      tile.position = [newRow, newCol];
    });

    if (moved) {
      const newTile = addRandomTile(newTiles);
      setTiles([...newTiles, newTile]);
      setScore(newScore);
      
      if (isGameOver([...newTiles, newTile])) {
        setGameOver(true);
      }
    }
  };

  const isGameOver = (currentTiles: Tile[]): boolean => {
    if (currentTiles.length < GRID_SIZE * GRID_SIZE) return false;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const currentTile = currentTiles.find(t => t.position[0] === i && t.position[1] === j);
        if (!currentTile) continue;

        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dx, dy] of directions) {
          const newRow = i + dx;
          const newCol = j + dy;
          
          if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
            const adjacentTile = currentTiles.find(t => t.position[0] === newRow && t.position[1] === newCol);
            if (!adjacentTile || adjacentTile.value === currentTile.value) {
              return false;
            }
          }
        }
      }
    }
    
    return true;
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => moveTiles('left'),
    onSwipedRight: () => moveTiles('right'),
    onSwipedUp: () => moveTiles('up'),
    onSwipedDown: () => moveTiles('down'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          moveTiles('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveTiles('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveTiles('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveTiles('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, tiles]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-[#776e65]">2048</h1>
        <div className="flex items-center gap-8">
          <div className="bg-[#bbada0] flex items-center rounded-md gap-2 px-86 py-2 text-white">
            <h2 className="uppercase tracking-wide">Score :</h2>
            <p className="text-xl font-bold">{score}</p>
          </div>
          <Button 
            onClick={initializeGame}
            className="bg-[#8f7a66] hover:bg-[#7f6a56] text-white h-full px-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </div>
      </div>

      <div 
        {...handlers}
        className="relative bg-[#bbada0] rounded-lg p-2 w-[50rem] h-[50rem]"
      >
        {/* Background grid */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#cdc1b4] rounded-md"
            style={{
              width: `${CELL_SIZE}rem`,
              height: `${CELL_SIZE}rem`,
              left: `${CELL_GAP + (i % GRID_SIZE) * (CELL_SIZE + CELL_GAP)}rem`,
              top: `${CELL_GAP + Math.floor(i / GRID_SIZE) * (CELL_SIZE + CELL_GAP)}rem`,
            }}
          />
        ))}

        {/* Tiles */}
        <AnimatePresence>
          {tiles.map(tile => (
            <GameTile key={tile.id} tile={tile} />
          ))}
        </AnimatePresence>
      </div>

      {/* Control buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <Button
          onClick={() => moveTiles('up')}
          className="w-12 h-12 bg-[#8f7a66] hover:bg-[#7f6a56] mx-auto"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => moveTiles('left')}
            className="w-12 h-12 bg-[#8f7a66] hover:bg-[#7f6a56]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={() => moveTiles('down')}
            className="w-12 h-12 bg-[#8f7a66] hover:bg-[#7f6a56]"
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
          <Button
            onClick={() => moveTiles('right')}
            className="w-12 h-12 bg-[#8f7a66] hover:bg-[#7f6a56]"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Game Over Screen */}
      {(gameOver || won) && (
        <GameOverScreen
          score={score}
          won={won}
          onRestart={initializeGame}
        />
      )}
    </div>
  );
}