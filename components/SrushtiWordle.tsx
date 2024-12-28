'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { getRandomWord, checkGuess, ALPHABET } from '../utils/wordleUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VirtualKeyboard } from './VirtualKeyboard';
import { motion } from 'framer-motion';
import wordExists from 'word-exists';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

interface LetterTileProps {
  currentLetter: string;
  status: string;
  shouldAnimate: boolean;
  colIndex: number;
}

const LetterTile: React.FC<LetterTileProps> = ({ 
  currentLetter, 
  status, 
  shouldAnimate,
  colIndex 
}) => {
  const [showColor, setShowColor] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShowColor(true);
      }, colIndex * 300 + 150); // Half the flip duration
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, colIndex]);

  return (
    <motion.div
      initial={shouldAnimate ? { rotateX: 0 } : undefined}
      animate={shouldAnimate ? {
        rotateX: [0, 90, 0],
        transition: {
          duration: 0.45,
          delay: colIndex * 0.3,
          times: [0, 0.5, 1]
        }
      } : {}}
      style={{ transformStyle: 'preserve-3d' }}
      className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold
        ${shouldAnimate && showColor ? (
          status === 'correct' ? 'bg-[#6aaa64] text-white border-[#6aaa64]' : 
          status === 'present' ? 'bg-[#c9b458] text-white border-[#c9b458]' : 
          'bg-[#787c7e] text-white border-[#787c7e]'
        ) : currentLetter ? 'bg-white text-black border-[#878a8c]' :
          'bg-white text-black border-[#d3d6da]'}`}
    >
      {currentLetter}
    </motion.div>
  );
};

export default function SrushtiWordle() {
  const [answer, setAnswer] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [guessedLetters, setGuessedLetters] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) return;
    
    // Check if the word exists in English dictionary
    if (!wordExists(currentGuess.toLowerCase())) {
      setError('Not a valid English word');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    updateGuessedLetters(newGuesses, answer);
    setCurrentGuess('');

    if (currentGuess === answer || newGuesses.length === MAX_GUESSES) {
      setGameOver(true);
    }
  }, [currentGuess, guesses, answer]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    setError('');
    
    if (e.key === 'Enter' || e.key === 'Return') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      }
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (ALPHABET.includes(e.key.toUpperCase()) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + e.key.toUpperCase());
    }
  }, [gameOver, currentGuess.length, submitGuess]);

  useEffect(() => {
    const savedState = localStorage.getItem('srushtiWordleState');
    if (savedState) {
      const { answer, guesses, gameOver } = JSON.parse(savedState);
      setAnswer(answer);
      setGuesses(guesses);
      setGameOver(gameOver);
      updateGuessedLetters(guesses, answer);
    } else {
      const newWord = getRandomWord();
      console.log('New word:', newWord); // For debugging
      setAnswer(newWord);
    }
  }, []); // Only run on mount

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    localStorage.setItem('srushtiWordleState', JSON.stringify({ answer, guesses, gameOver }));
  }, [answer, guesses, gameOver]);

  const updateGuessedLetters = (newGuesses: string[], currentAnswer: string) => {
    const newGuessedLetters: Record<string, string> = {};
    newGuesses.forEach(guess => {
      const statuses = checkGuess(guess, currentAnswer);
      guess.split('').forEach((letter, index) => {
        const currentStatus = newGuessedLetters[letter];
        const newStatus = statuses[index];
        // Only update if the new status is 'better' than the current one
        if (!currentStatus || 
            (currentStatus === 'absent' && (newStatus === 'present' || newStatus === 'correct')) ||
            (currentStatus === 'present' && newStatus === 'correct')) {
          newGuessedLetters[letter] = newStatus;
        }
      });
    });
    setGuessedLetters(newGuessedLetters);
  };

  const handleKeyPress = (key: string) => {
    if (gameOver) return;
    
    setError('');

    if (key === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (ALPHABET.includes(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const renderGrid = () => {
    return (
      <div className="grid grid-rows-6 gap-1">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
          <motion.div 
            key={rowIndex} 
            className="grid grid-cols-5 gap-1"
            animate={shake && rowIndex === guesses.length ? {
              x: [-10, 10, -10, 10, 0],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
              const letter = guesses[rowIndex]?.[colIndex] || '';
              const isCurrentRow = rowIndex === guesses.length;
              const currentLetter = isCurrentRow ? currentGuess[colIndex] || '' : letter;
              const status = guesses[rowIndex] ? checkGuess(guesses[rowIndex], answer)[colIndex] : '';
              const shouldAnimate: boolean = Boolean(guesses[rowIndex] && guesses[rowIndex] === guesses[guesses.length - 1]);
              
              return (
                <LetterTile
                  key={colIndex}
                  currentLetter={currentLetter}
                  status={status}
                  shouldAnimate={shouldAnimate}
                  colIndex={colIndex}
                />
              );
            })}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Srushti&apos;s Wordle</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-8">
          {renderGrid()}
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
          </div>
        )}
        <div className="w-full">
          <VirtualKeyboard onKeyPress={handleKeyPress} guessedLetters={guessedLetters} />
          {gameOver && (
            <div className="mt-4 text-center">
              {guesses[guesses.length - 1] === answer ? "Congratulations! You won!" : `Game Over. The word was ${answer}.`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

