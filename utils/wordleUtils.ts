export const words = [
  "APPLE", "BEACH", "CLOUD", "DANCE", "EAGLE", "FLUTE", "GRAPE", "HOUSE", "IGLOO", "JUICE",
  "KITE", "LEMON", "MANGO", "NURSE", "OCEAN", "PIANO", "QUEEN", "RIVER", "SMILE", "TIGER",
  "BREAD", "CHAIR", "DREAM", "EARTH", "FLAME", "GHOST", "HEART", "IMAGE", "KNIFE", "LIGHT",
  "MONEY", "NIGHT", "PAINT", "QUICK", "RADIO", "SNAKE", "TRAIN", "UNCLE", "VOICE", "WATER",
  "YOUTH", "ZEBRA", "BRAIN", "CLOCK", "DRINK", "FAIRY", "GREEN", "HAPPY", "IVORY", "JELLY"
];

export const getRandomWord = () => {
  if (words.length === 0) return "HELLO"; // Fallback word
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

export const checkGuess = (guess: string, answer: string) => {
  return guess.split('').map((letter, index) => {
    if (letter === answer[index]) {
      return 'correct';
    } else if (answer.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  });
};

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const KEYBOARD_KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

