import React, { useRef, useEffect } from 'react';
import { CellData, Direction } from '../types';

interface GridProps {
  grid: CellData[][];
  dimensions: number;
  onCellClick: (row: number, col: number) => void;
  onInputChange: (row: number, col: number, char: string) => void;
  onKeyDown: (e: React.KeyboardEvent, row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
  selectedDirection: Direction;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  dimensions,
  onCellClick,
  onInputChange,
  onKeyDown,
  selectedCell,
  selectedDirection
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Initialize refs array
  if (inputRefs.current.length !== dimensions) {
    inputRefs.current = Array(dimensions).fill(null).map(() => Array(dimensions).fill(null));
  }

  // Focus effect
  useEffect(() => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      inputRefs.current[row]?.[col]?.focus();
    }
  }, [selectedCell]);

  return (
    <div 
      className="grid gap-[1px] bg-gray-800 border-4 border-gray-800 rounded-lg shadow-xl overflow-hidden mx-auto"
      style={{ 
        gridTemplateColumns: `repeat(${dimensions}, minmax(0, 1fr))`,
        maxWidth: dimensions > 10 ? '100%' : '600px'
      }}
    >
      {grid.map((row, rIndex) => (
        row.map((cell, cIndex) => {
          if (cell.isBlack) {
            return (
              <div 
                key={`${rIndex}-${cIndex}`} 
                className="bg-gray-900 w-full aspect-square"
              />
            );
          }

          const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
          
          let bgColor = 'bg-white';
          if (cell.isCorrect) bgColor = 'bg-green-100';
          else if (isSelected) bgColor = 'bg-yellow-200';
          else if (cell.isPartOfFocus) bgColor = 'bg-blue-50';

          return (
            <div key={`${rIndex}-${cIndex}`} className={`relative aspect-square ${bgColor} transition-colors duration-150`}>
              {/* Clue Number */}
              {(cell.clueNumbers.across || cell.clueNumbers.down) && (
                <span className="absolute top-0.5 right-1 text-[10px] md:text-xs font-bold text-gray-500 pointer-events-none select-none">
                  {cell.clueNumbers.across || cell.clueNumbers.down}
                </span>
              )}
              
              <input
                ref={el => inputRefs.current[rIndex][cIndex] = el}
                type="text"
                maxLength={1}
                value={cell.userChar}
                className={`w-full h-full text-center text-lg md:text-2xl font-bold bg-transparent outline-none p-0 ${cell.isCorrect ? 'text-green-700' : 'text-gray-900'}`}
                onChange={(e) => onInputChange(rIndex, cIndex, e.target.value)}
                onKeyDown={(e) => onKeyDown(e, rIndex, cIndex)}
                onClick={() => onCellClick(rIndex, cIndex)}
                dir="rtl"
                autoComplete="off"
              />
            </div>
          );
        })
      ))}
    </div>
  );
};