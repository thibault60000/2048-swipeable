"use client";

import { motion } from 'framer-motion';

const CELL_SIZE = 10;
const CELL_GAP = 2;

const tileColors: Record<number, { bg: string; text: string }> = {
  2: { bg: '#eee4da', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#f9f6f2' },
  16: { bg: '#f59563', text: '#f9f6f2' },
  32: { bg: '#f67c5f', text: '#f9f6f2' },
  64: { bg: '#f65e3b', text: '#f9f6f2' },
  128: { bg: '#edcf72', text: '#f9f6f2' },
  256: { bg: '#edcc61', text: '#f9f6f2' },
  512: { bg: '#edc850', text: '#f9f6f2' },
  1024: { bg: '#edc53f', text: '#f9f6f2' },
  2048: { bg: '#edc22e', text: '#f9f6f2' },
};

type GameTileProps = {
  tile: {
    value: number;
    position: [number, number];
    mergedFrom?: boolean;
  };
};

export default function GameTile({ tile }: GameTileProps) {
  const { value, position: [row, col] } = tile;
  const colors = tileColors[value] || tileColors[2048];

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        x: `${CELL_GAP + col * (CELL_SIZE + CELL_GAP)}rem`,
        y: `${CELL_GAP + row * (CELL_SIZE + CELL_GAP)}rem`,
      }}
      exit={{ scale: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25
      }}
      className="absolute flex items-center justify-center rounded-md font-bold"
      style={{
        width: `${CELL_SIZE}rem`,
        height: `${CELL_SIZE}rem`,
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: value >= 1000 ? '2rem' : '3rem',
      }}
    >
      {value}
    </motion.div>
  );
}