
import React, { useState, useEffect, useRef } from 'react';

const Pomodoro: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  // Fix: Replaced NodeJS.Timeout with any to avoid namespace errors in browser environment
  const timerRef = useRef<any>(null);

  const startTimer = (minutes: number) => {
    const s = minutes * 60;
    setTotalSeconds(s);
    setSeconds(s);
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setTotalSeconds(0);
  };

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress for the ring animation
  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;
  const strokeDasharray = 283; // 2 * PI * r (r=45)
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

  return (
    <div className="flex flex-col items-center justify-center mb-8 pointer-events-auto">
      {isActive ? (
        <div 
          className="relative flex items-center justify-center cursor-pointer group"
          onClick={resetTimer}
        >
          {/* Holographic Ring */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-gray-900"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
              className={`${seconds < 60 ? 'text-red-500 animate-pulse' : 'text-cyan-400'} drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]`}
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-mono font-bold text-white tracking-widest">
              {formatTime(seconds)}
            </span>
            <span className="text-[8px] text-cyan-500/50 font-mono animate-pulse uppercase">
              {seconds < 60 ? 'CRITICAL_END' : 'CHRONO_ACTIVE'}
            </span>
          </div>
          
          {/* Reset Indicator on Hover/Touch */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-full transition-opacity">
             <span className="text-[8px] font-mono text-red-400">ABORT_SYNC</span>
          </div>
        </div>
      ) : (
        <div className="flex space-x-4 items-center animate-fade-in">
          {[5, 10, 15].map((min) => (
            <button
              key={min}
              onClick={() => startTimer(min)}
              className="relative group flex flex-col items-center p-3 border border-cyan-500/20 hover:border-cyan-400/60 bg-black/40 transition-all rounded"
            >
              <span className="text-xs font-mono text-cyan-400 font-bold">{min}m</span>
              <div className="w-full h-[1px] bg-cyan-500/20 mt-1 group-hover:bg-cyan-400 transition-colors" />
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-cyan-500 opacity-0 group-hover:opacity-100" />
              <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-cyan-500 opacity-0 group-hover:opacity-100" />
            </button>
          ))}
          <div className="flex flex-col ml-2 opacity-30">
            <span className="text-[7px] text-gray-500 font-mono tracking-tighter uppercase">Protocol</span>
            <span className="text-[7px] text-gray-400 font-mono font-bold">POMO_v1</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
