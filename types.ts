export type Direction = 'across' | 'down';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GeneratedWord {
  text: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
  clueType: 'standard' | 'math' | 'metaphor' | 'compound' | 'encrypted' | 'cultural';
}

export interface GeneratedPuzzle {
  title: string;
  words: GeneratedWord[];
  dimensions: number; // e.g., 9 for 9x9
}

export interface CellData {
  char: string | null; // The correct character (if part of a word)
  userChar: string; // What the user typed
  isActive: boolean; // Is part of a word
  isBlack: boolean; // Is a black square
  clueNumbers: {
    across?: number;
    down?: number;
  };
  isPartOfFocus: boolean; // Highlight logic
  isFocused: boolean; // Cursor logic
  isCorrect?: boolean; // For validation
  isRevealed?: boolean;
}

export interface Clue {
  number: number;
  direction: Direction;
  text: string;
  type: string;
  answer: string;
  row: number;
  col: number;
}

export interface GameState {
  status: 'menu' | 'loading' | 'playing' | 'won';
  grid: CellData[][];
  clues: Clue[];
  difficulty: Difficulty;
  timer: number;
  score: number;
  selectedCell: { row: number; col: number } | null;
  selectedDirection: Direction;
}