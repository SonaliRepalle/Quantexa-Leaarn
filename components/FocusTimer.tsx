import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, CheckCircle } from 'lucide-react';

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (mode === 'focus') setTotalTime(t => t + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 283 // 283 is approx circumf of r=45
    : ((5 * 60 - timeLeft) / (5 * 60)) * 283;

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in text-center">
      <div className="bg-secondary border border-gray-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Bg */}
        <div className={`absolute inset-0 opacity-10 transition-colors duration-1000 ${mode === 'focus' ? 'bg-blue-600' : 'bg-green-600'}`}></div>

        <div className="relative z-10">
            <div className="flex justify-center space-x-4 mb-8">
                <button
                onClick={() => switchMode('focus')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'focus' ? 'bg-primary text-white' : 'bg-black/30 text-gray-400'}`}
                >
                Focus
                </button>
                <button
                onClick={() => switchMode('break')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'break' ? 'bg-green-600 text-white' : 'bg-black/30 text-gray-400'}`}
                >
                Break
                </button>
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1F2937" strokeWidth="8" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={mode === 'focus' ? '#3B82F6' : '#10B981'}
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - progress}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white font-mono">{formatTime(timeLeft)}</span>
                    <span className="text-sm text-gray-400 mt-2 uppercase tracking-widest">{isActive ? 'Running' : 'Paused'}</span>
                </div>
            </div>

            <div className="flex justify-center space-x-6">
                <button
                    onClick={toggleTimer}
                    className="w-16 h-16 rounded-full bg-white text-secondary flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-16 h-16 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                    <RotateCcw size={24} />
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between text-sm">
                <div className="text-gray-400">
                    <p className="flex items-center justify-center"><CheckCircle size={14} className="mr-1"/> Sessions</p>
                    <p className="text-white font-bold text-lg">3</p>
                </div>
                <div className="text-gray-400">
                    <p className="flex items-center justify-center"><Coffee size={14} className="mr-1"/> Total Focus</p>
                    <p className="text-white font-bold text-lg">{Math.floor(totalTime / 60)}m</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;