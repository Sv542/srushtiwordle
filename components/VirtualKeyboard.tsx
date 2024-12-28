import React from 'react';
import { Button } from "@/components/ui/button"
import { KEYBOARD_KEYS } from '../utils/wordleUtils';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  guessedLetters: Record<string, string>;
}

export function VirtualKeyboard({ onKeyPress, guessedLetters }: VirtualKeyboardProps) {
  return (
    <div className="mt-4">
      {KEYBOARD_KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5 mb-2">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`
                h-14 ${key.length > 1 ? 'px-4 text-xs' : 'w-10 px-0 text-sm'}
                font-semibold rounded
                ${guessedLetters[key] === 'correct'
                  ? 'bg-[#6aaa64] hover:bg-[#6aaa64]/90 text-white border-[#6aaa64]'
                  : guessedLetters[key] === 'present'
                  ? 'bg-[#c9b458] hover:bg-[#c9b458]/90 text-white border-[#c9b458]'
                  : guessedLetters[key] === 'absent'
                  ? 'bg-[#787c7e] hover:bg-[#787c7e]/90 text-white border-[#787c7e]'
                  : 'bg-[#d3d6da] hover:bg-[#d3d6da]/90 text-black'
                }
              `}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}

