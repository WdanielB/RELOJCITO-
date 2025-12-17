
import React, { useState, useEffect, useRef } from 'react';

const Pomodoro: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
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

  const percentage = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;
  const isCritical = seconds > 0 && seconds < 60;

  return (
    <div className="w-full flex flex-col pointer-events-auto">
      {!isActive ? (
        <div className="grid grid-cols-3 gap-3 w-full animate-fade-in">
          {[5, 15, 25].map((min) => (
            <button
              key={min}
              onClick={() => startTimer(min)}
              className="group relative h-14 border border-red-950/40 bg-black/40 hover:border-red-600/50 transition-all flex flex-col items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-600/5 translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative text-xs font-mono text-red-800 group-hover:text-red-500 transition-colors uppercase font-bold tracking-widest">{min}m</span>
              <div className="w-1 h-1 bg-red-600 opacity-0 group-hover:opacity-100 absolute top-1 right-1" />
            </button>
          ))}
        </div>
      ) : (
        <div 
          className="flex flex-col space-y-3 cursor-pointer group w-full"
          onClick={resetTimer}
        >
          {/* Header */}
          <div className="flex justify-between items-baseline px-1">
            <span className="text-[9px] text-red-600 font-mono tracking-[0.2em] font-bold">
              {isCritical ? 'ALERT_LOW_TIME' : 'FOCUS_SYNC_ACTIVE'}
            </span>
            <span className="text-sm font-mono text-red-400 opacity-80">{percentage.toFixed(1)}%</span>
          </div>

          {/* Time & Bar Container */}
          <div className="relative">
             <div className="absolute -top-12 left-0 right-0 text-center">
                <span className={`text-6xl font-mono font-black tracking-tighter ${isCritical ? 'text-red-500 animate-pulse' : 'text-white'} drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]`}>
                  {formatTime(seconds)}
                </span>
             </div>
             
             {/* Progress Bar Body */}
             <div className="h-6 w-full bg-red-950/20 border border-red-900/30 relative overflow-hidden mt-4">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(220,38,38,0.4)] ${isCritical ? 'bg-red-600' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                />
                {/* HUD Grid Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(90deg, #ff0000 1px, transparent 1px)', backgroundSize: '10% 100%' }} />
             </div>
          </div>

          {/* Abort Hint */}
          <div className="text-center">
            <span className="text-[7px] font-mono text-red-900 group-hover:text-red-600 transition-colors uppercase tracking-[0.5em]">TOCAR_PARA_CANCELAR</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
