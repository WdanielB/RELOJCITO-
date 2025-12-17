
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
    <div className="w-full max-w-4xl px-6 mb-12 pointer-events-auto">
      {!isActive ? (
        <div className="flex justify-center items-center space-x-6 animate-pulse">
          <div className="hidden sm:block h-[1px] w-20 bg-gradient-to-r from-transparent to-red-900" />
          {[5, 10, 15].map((min) => (
            <button
              key={min}
              onClick={() => startTimer(min)}
              className="relative px-6 py-2 border border-red-500/20 bg-red-950/10 hover:bg-red-600/20 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative text-sm font-mono text-red-500 font-bold tracking-tighter">SELECT_{min}M</span>
            </button>
          ))}
          <div className="hidden sm:block h-[1px] w-20 bg-gradient-to-l from-transparent to-red-900" />
        </div>
      ) : (
        <div 
          className="flex flex-col space-y-2 cursor-pointer group"
          onClick={resetTimer}
        >
          {/* Header info */}
          <div className="flex justify-between items-end px-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-red-600 font-mono tracking-widest uppercase">
                {isCritical ? '!!! ALERT: CHRONO_DEPLETION !!!' : 'DEEP_FOCUS_PROTOCOL'}
              </span>
              <span className="text-2xl font-mono font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                {formatTime(seconds)}
              </span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-red-900 font-mono">STABILITY_REF</span>
              <span className="text-xl font-mono font-light text-red-400 opacity-80">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="relative h-4 w-full bg-red-950/20 border border-red-900/30 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ff0000 10px, #ff0000 11px)' }} />
            
            {/* Main Progress Fill */}
            <div 
              className={`h-full transition-all duration-1000 ease-linear relative ${isCritical ? 'bg-red-600' : 'bg-red-500'}`}
              style={{ width: `${percentage}%` }}
            >
              {/* Scanning Light Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 animate-[scan_2s_linear_infinite]" 
                   style={{ left: '-5rem' }} />
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex justify-between items-center opacity-40">
            <span className="text-[7px] font-mono text-red-500">ABORT_CMD: [TAP_ANYWHERE]</span>
            <div className="flex space-x-1">
              {Array.from({length: 10}).map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${i/10 < percentage/100 ? 'bg-red-500' : 'bg-red-950'}`} />
              ))}
            </div>
            <span className="text-[7px] font-mono text-red-500 uppercase">System_Clock_Sync: Active</span>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { transform: translateX(0); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  );
};

export default Pomodoro;
