"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Rotate } from 'lucide-react';

type GameOverScreenProps = {
  score: number;
  won: boolean;
  onRestart: () => void;
};

export default function GameOverScreen({ score, won, onRestart }: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 text-center max-w-md mx-4"
      >
        {won ? (
          <div className="flex flex-col items-center gap-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
            <h2 className="text-3xl font-bold text-[#776e65]">You Won!</h2>
            <p className="text-lg text-gray-600">
              Congratulations! You've reached 2048!
            </p>
          </div>
        ) : (
          <h2 className="text-3xl font-bold text-[#776e65] mb-4">Game Over!</h2>
        )}
        
        <p className="text-xl text-gray-600 mt-4">
          Final Score: <span className="font-bold">{score}</span>
        </p>
        
        <Button
          onClick={onRestart}
          className="mt-6 bg-[#8f7a66] hover:bg-[#7f6a56] text-white"
        >
          <Rotate className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      </motion.div>
    </motion.div>
  );
}