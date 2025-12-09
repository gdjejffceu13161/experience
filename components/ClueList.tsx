import React from 'react';
import { Clue, Direction } from '../types';

interface ClueListProps {
  clues: Clue[];
  selectedClueNumber: number | null;
  selectedDirection: Direction;
  onClueClick: (clue: Clue) => void;
}

export const ClueList: React.FC<ClueListProps> = ({ 
  clues, 
  selectedClueNumber, 
  selectedDirection,
  onClueClick 
}) => {
  const acrossClues = clues.filter(c => c.direction === 'across').sort((a, b) => a.number - b.number);
  const downClues = clues.filter(c => c.direction === 'down').sort((a, b) => a.number - b.number);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'math': return <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full mr-2">رياضيات</span>;
      case 'cultural': return <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full mr-2">ثقافة</span>;
      case 'encrypted': return <span className="text-[10px] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full mr-2">شفرة</span>;
      case 'metaphor': return <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full mr-2">مجاز</span>;
      case 'compound': return <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full mr-2">مركب</span>;
      default: return null;
    }
  };

  const renderClueGroup = (title: string, groupClues: Clue[]) => (
    <div className="flex-1 min-w-[250px] flex flex-col h-full overflow-hidden">
      <h3 className="bg-indigo-600 text-white p-2 text-center font-bold text-lg sticky top-0 z-10 shadow-md">
        {title}
      </h3>
      <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-2 bg-white/80">
        {groupClues.map(clue => {
          const isActive = selectedClueNumber === clue.number && selectedDirection === clue.direction;
          return (
            <div
              key={`${clue.direction}-${clue.number}`}
              onClick={() => onClueClick(clue)}
              className={`
                cursor-pointer p-3 rounded-lg border transition-all duration-200
                ${isActive ? 'bg-indigo-50 border-indigo-500 shadow-sm transform scale-[1.02]' : 'bg-white border-gray-200 hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold text-lg ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {clue.number}
                </span>
                {getTypeBadge(clue.type)}
              </div>
              <p className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {clue.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {renderClueGroup('أفقي', acrossClues)}
      {renderClueGroup('عمودي', downClues)}
    </div>
  );
};