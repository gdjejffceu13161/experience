
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { generatePuzzle } from './services/geminiService';
import { STATIC_LEVELS } from './data/staticLevels';
import { Grid } from './components/Grid';
import { ClueList } from './components/ClueList';
import { GameControls } from './components/GameControls';
import { Difficulty, GameState, CellData, GeneratedPuzzle, Clue, Direction } from './types';
import { DIFFICULTY_CONFIG } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'levels' | 'ai'>('levels');
  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    grid: [],
    clues: [],
    difficulty: 'easy',
    timer: 0,
    score: 0,
    selectedCell: null,
    selectedDirection: 'across',
  });

  const [loadingMsg, setLoadingMsg] = useState('جاري إعداد اللغز...');

  // Timer Effect
  useEffect(() => {
    let interval: number;
    if (gameState.status === 'playing') {
      interval = window.setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status]);

  const setupGameFromData = (puzzleData: GeneratedPuzzle, difficulty: Difficulty) => {
      const size = puzzleData.dimensions;
      
      // Initialize empty grid
      const newGrid: CellData[][] = Array(size).fill(null).map(() => 
        Array(size).fill(null).map(() => ({
          char: null,
          userChar: '',
          isActive: false,
          isBlack: true,
          clueNumbers: {},
          isPartOfFocus: false,
          isFocused: false,
          isCorrect: false
        }))
      );

      const newClues: Clue[] = [];
      let clueCounter = 1;

      // Map words to grid
      puzzleData.words.forEach(word => {
        // Validate bounds
        if (word.row < 0 || word.col < 0 || word.row >= size || word.col >= size) return;

        // Assign clue number if not exists at this cell
        let currentNumber = newGrid[word.row][word.col].clueNumbers.across || newGrid[word.row][word.col].clueNumbers.down;
        
        if (!currentNumber) {
           currentNumber = clueCounter++;
        }

        // Update cell with clue number
        if (word.direction === 'across') {
          newGrid[word.row][word.col].clueNumbers.across = currentNumber;
        } else {
          newGrid[word.row][word.col].clueNumbers.down = currentNumber;
        }

        newClues.push({
          number: currentNumber,
          direction: word.direction,
          text: word.clue,
          type: word.clueType,
          answer: word.text,
          row: word.row,
          col: word.col
        });

        // Carve out the word in the grid
        for (let i = 0; i < word.text.length; i++) {
          const r = word.direction === 'down' ? word.row + i : word.row;
          const c = word.direction === 'across' ? word.col + i : word.col;
          
          if (r < size && c < size) {
            newGrid[r][c].isBlack = false;
            newGrid[r][c].isActive = true;
            newGrid[r][c].char = word.text[i];
          }
        }
      });

      // Find first active cell for selection
      let firstCell = null;
      for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
          if(!newGrid[r][c].isBlack) {
            firstCell = { row: r, col: c };
            break;
          }
        }
        if(firstCell) break;
      }

      setGameState({
        status: 'playing',
        grid: newGrid,
        clues: newClues,
        difficulty,
        timer: 0,
        score: 0,
        selectedCell: firstCell,
        selectedDirection: 'across'
      });
      
      // Initial Highlight Update
      if(firstCell) updateHighlights(newGrid, firstCell, 'across', newClues);
  };

  const loadStaticLevel = (index: number) => {
    const levelData = STATIC_LEVELS[index];
    setupGameFromData(levelData, 'medium'); // Defaulting static levels to 'medium' for type consistency
  };

  const initializeAIGame = async (difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, status: 'loading', difficulty }));
    setLoadingMsg("جاري استدعاء الذكاء الاصطناعي لتوليد الشبكة والتلميحات...");
    
    try {
      const puzzleData = await generatePuzzle(difficulty);
      setupGameFromData(puzzleData, difficulty);
    } catch (error) {
      alert("حدث خطأ أثناء تحميل اللعبة، يرجى المحاولة مرة أخرى.");
      setGameState(prev => ({ ...prev, status: 'menu' }));
    }
  };

  const updateHighlights = (grid: CellData[][], cell: {row: number, col: number}, direction: Direction, clues: Clue[]) => {
    const newGrid = grid.map(row => row.map(c => ({ ...c, isPartOfFocus: false, isFocused: false })));
    
    // Highlight focused cell
    newGrid[cell.row][cell.col].isFocused = true;

    // Find the word belonging to this cell and direction
    const relevantClue = clues.find(c => {
        if (c.direction !== direction) return false;
        if (direction === 'across') {
            return c.row === cell.row && cell.col >= c.col && cell.col < c.col + c.answer.length;
        } else {
            return c.col === cell.col && cell.row >= c.row && cell.row < c.row + c.answer.length;
        }
    });

    if (relevantClue) {
        for (let i = 0; i < relevantClue.answer.length; i++) {
            const r = relevantClue.direction === 'down' ? relevantClue.row + i : relevantClue.row;
            const c = relevantClue.direction === 'across' ? relevantClue.col + i : relevantClue.col;
            if (newGrid[r] && newGrid[r][c]) {
                newGrid[r][c].isPartOfFocus = true;
            }
        }
    }

    setGameState(prev => ({ ...prev, grid: newGrid, selectedCell: cell, selectedDirection: direction }));
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.grid[row][col].isBlack) return;

    let newDirection = gameState.selectedDirection;

    // Toggle direction if clicking the same cell
    if (gameState.selectedCell?.row === row && gameState.selectedCell?.col === col) {
      newDirection = gameState.selectedDirection === 'across' ? 'down' : 'across';
    } else {
        // Intelligent direction switching could go here
    }

    updateHighlights(gameState.grid, { row, col }, newDirection, gameState.clues);
  };

  const handleInputChange = (row: number, col: number, char: string) => {
    // Only allow Arabic letters or empty
    if (char && !/[\u0600-\u06FF]/.test(char)) return;

    const newGrid = [...gameState.grid];
    newGrid[row][col].userChar = char;
    
    // Auto-advance
    if (char) {
      let nextRow = row;
      let nextCol = col;
      
      if (gameState.selectedDirection === 'across') {
        nextCol++;
      } else {
        nextRow++;
      }

      // Check bounds and if next is black
      if (
        nextRow < newGrid.length && 
        nextCol < newGrid.length && 
        !newGrid[nextRow][nextCol].isBlack
      ) {
        handleCellClick(nextRow, nextCol);
      }
    } else {
        // Update state without moving
        setGameState(prev => ({ ...prev, grid: newGrid }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Backspace') {
        const newGrid = [...gameState.grid];
        // If current is empty, move back then delete
        if (!newGrid[row][col].userChar) {
            let prevRow = row;
            let prevCol = col;
            if (gameState.selectedDirection === 'across') prevCol--;
            else prevRow--;

            if (prevRow >= 0 && prevCol >= 0 && !newGrid[prevRow][prevCol].isBlack) {
                handleCellClick(prevRow, prevCol);
            }
        } else {
             newGrid[row][col].userChar = '';
             setGameState(prev => ({ ...prev, grid: newGrid }));
        }
    } else if (e.key === 'ArrowRight') {
        if(col > 0 && !gameState.grid[row][col-1].isBlack) handleCellClick(row, col - 1);
    } else if (e.key === 'ArrowLeft') {
        if(col < gameState.grid.length - 1 && !gameState.grid[row][col+1].isBlack) handleCellClick(row, col + 1);
    } else if (e.key === 'ArrowUp') {
        if(row > 0 && !gameState.grid[row-1][col].isBlack) handleCellClick(row - 1, col);
    } else if (e.key === 'ArrowDown') {
        if(row < gameState.grid.length - 1 && !gameState.grid[row+1][col].isBlack) handleCellClick(row + 1, col);
    }
  };

  const handleClueClick = (clue: Clue) => {
    updateHighlights(gameState.grid, { row: clue.row, col: clue.col }, clue.direction, gameState.clues);
  };

  const checkAnswers = () => {
    const newGrid = gameState.grid.map(row => row.map(cell => {
      if (!cell.isActive || cell.isBlack) return cell;
      return {
        ...cell,
        isCorrect: cell.userChar === cell.char
      };
    }));
    
    // Calculate if won
    const allCorrect = newGrid.every(row => row.every(cell => 
        cell.isBlack || !cell.isActive || (cell.userChar === cell.char)
    ));

    if (allCorrect) {
        setGameState(prev => ({ ...prev, grid: newGrid, status: 'won', score: prev.score + 100 }));
    } else {
        setGameState(prev => ({ ...prev, grid: newGrid }));
    }
  };

  const revealLetter = () => {
      if (!gameState.selectedCell) return;
      const { row, col } = gameState.selectedCell;
      const cell = gameState.grid[row][col];
      
      if (cell.isBlack || !cell.char) return;

      const newGrid = [...gameState.grid];
      newGrid[row][col].userChar = cell.char;
      newGrid[row][col].isCorrect = true; 

      setGameState(prev => ({ 
          ...prev, 
          grid: newGrid,
          score: Math.max(0, prev.score - 5)
      }));
  };

  const revealWord = () => {
      if (!gameState.selectedCell) return;
      
      const { row, col } = gameState.selectedCell;
      const dir = gameState.selectedDirection;

      // Find relevant clue
      const clue = gameState.clues.find(c => {
        if (c.direction !== dir) return false;
        if (dir === 'across') {
            return c.row === row && col >= c.col && col < c.col + c.answer.length;
        } else {
            return c.col === col && row >= c.row && row < c.row + c.answer.length;
        }
      });

      if (clue) {
          const newGrid = [...gameState.grid];
          for(let i=0; i<clue.answer.length; i++) {
              const r = dir === 'down' ? clue.row + i : clue.row;
              const c = dir === 'across' ? clue.col + i : clue.col;
              newGrid[r][c].userChar = clue.answer[i];
              newGrid[r][c].isCorrect = true;
          }
           setGameState(prev => ({ 
            ...prev, 
            grid: newGrid,
            score: Math.max(0, prev.score - 15)
        }));
      }
  };

  const getCurrentClueNumber = () => {
      if (!gameState.selectedCell) return null;
      const { row, col } = gameState.selectedCell;
      const dir = gameState.selectedDirection;
      const clue = gameState.clues.find(c => {
        if (c.direction !== dir) return false;
        if (dir === 'across') {
            return c.row === row && col >= c.col && col < c.col + c.answer.length;
        } else {
            return c.col === col && row >= c.row && row < c.row + c.answer.length;
        }
      });
      return clue ? clue.number : null;
  };

  if (gameState.status === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center my-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">الكلمات المتقاطعة الذكية</h1>
          <p className="text-gray-500 mb-6">تحدى عقلك مع مراحل جاهزة أو ألغاز لا نهائية</p>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('levels')}
              className={`flex-1 py-3 font-bold text-lg transition-colors border-b-2 ${
                activeTab === 'levels' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              مراحل جاهزة
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 font-bold text-lg transition-colors border-b-2 ${
                activeTab === 'ai' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              تحدي الذكاء الاصطناعي
            </button>
          </div>

          {activeTab === 'levels' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {STATIC_LEVELS.map((level, index) => (
                 <button
                   key={index}
                   onClick={() => loadStaticLevel(index)}
                   className="flex flex-col items-center justify-center bg-gray-50 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-500 rounded-xl p-4 transition-all hover:shadow-md group"
                 >
                    <span className="text-2xl font-bold text-gray-300 group-hover:text-indigo-600 mb-1">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 truncate w-full">
                      {level.title.split(':')[1] || level.title}
                    </span>
                 </button>
               ))}
            </div>
          ) : (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                سيقوم الذكاء الاصطناعي (Gemini) بتوليد لغز جديد تماماً وفريد من نوعه عند اختيار أحد المستويات أدناه. قد يستغرق ذلك بضع ثوانٍ.
              </p>
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => initializeAIGame(diff)}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-sm border border-indigo-100 flex justify-between items-center"
                >
                  <span>{DIFFICULTY_CONFIG[diff].label}</span>
                  <span className="text-xl">✨</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 text-sm text-gray-400">
             مدعوم بواسطة Google Gemini 2.5
          </div>
        </div>
      </div>
    );
  }

  if (gameState.status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="text-xl text-gray-700 font-medium animate-pulse">{loadingMsg}</p>
      </div>
    );
  }

  if (gameState.status === 'won') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-green-700 mb-2">مبروك!</h2>
                <p className="text-gray-600 mb-6">لقد أكملت اللغز بنجاح.</p>
                <div className="bg-green-100 p-4 rounded-lg mb-6">
                    <p className="font-bold text-green-800">النقاط النهائية: {gameState.score}</p>
                    <p className="text-green-700">الوقت: {Math.floor(gameState.timer / 60)}:{gameState.timer % 60}</p>
                </div>
                <button 
                    onClick={() => setGameState(prev => ({ ...prev, status: 'menu' }))}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                    القائمة الرئيسية
                </button>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:h-screen overflow-hidden">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-indigo-800 flex items-center gap-2">
           <span>🧩</span> الكلمات المتقاطعة الذكية
        </h1>
        <div className="flex gap-2">
             <button 
                onClick={() => setGameState(prev => ({ ...prev, status: 'menu' }))}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-gray-700 transition-colors"
             >
                القائمة
             </button>
             <span className="text-sm bg-indigo-100 px-3 py-1 rounded-lg text-indigo-700 hidden md:inline-block">
                {gameState.difficulty === 'medium' && activeTab === 'levels' ? 'مرحلة جاهزة' : DIFFICULTY_CONFIG[gameState.difficulty].label}
            </span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Side: Game Board (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center overflow-auto">
            <Grid 
                grid={gameState.grid} 
                dimensions={gameState.grid.length}
                onCellClick={handleCellClick}
                onInputChange={handleInputChange}
                onKeyDown={handleKeyDown}
                selectedCell={gameState.selectedCell}
                selectedDirection={gameState.selectedDirection}
            />
        </div>

        {/* Right Side: Controls and Clues (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-hidden">
             <GameControls 
                onCheck={checkAnswers}
                onRevealLetter={revealLetter}
                onRevealWord={revealWord}
                onReset={() => setGameState(prev => ({ ...prev, status: 'menu' }))}
                score={gameState.score}
                timer={gameState.timer}
             />
             
             <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
                 <ClueList 
                    clues={gameState.clues}
                    selectedClueNumber={getCurrentClueNumber()}
                    selectedDirection={gameState.selectedDirection}
                    onClueClick={handleClueClick}
                 />
             </div>
        </div>
      </main>
    </div>
  );
};

// Create root
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
