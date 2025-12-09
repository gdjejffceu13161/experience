import React from 'react';

interface GameControlsProps {
  onCheck: () => void;
  onRevealLetter: () => void;
  onRevealWord: () => void;
  onReset: () => void;
  score: number;
  timer: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onCheck,
  onRevealLetter,
  onRevealWord,
  onReset,
  score,
  timer
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center border-b pb-4 mb-2">
        <div className="text-center">
            <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider">النقاط</span>
            <span className="text-2xl font-bold text-indigo-600">{score}</span>
        </div>
        <div className="text-center">
            <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider">الوقت</span>
            <span className="text-2xl font-bold text-gray-800 font-mono">{formatTime(timer)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onCheck}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
        >
            <span>✓</span> تحقق
        </button>
        <button 
          onClick={onReset}
          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-lg border border-red-200 transition-colors"
        >
          خروج
        </button>
      </div>
      
      <div className="space-y-2 pt-2">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center">مساعدة</p>
        <button 
          onClick={onRevealLetter}
          className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold py-2 px-4 rounded-lg border border-yellow-200 transition-colors text-sm"
        >
          كشف حرف ( -5 نقاط)
        </button>
        <button 
          onClick={onRevealWord}
          className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-2 px-4 rounded-lg border border-orange-200 transition-colors text-sm"
        >
          كشف كلمة (-15 نقطة)
        </button>
      </div>
    </div>
  );
};