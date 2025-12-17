
import React, { useState, useEffect } from 'react';
import { SystemStatus } from '../types';

interface FuturisticClockProps {
  onStatusUpdate: (status: SystemStatus) => void;
}

const FuturisticClock: React.FC<FuturisticClockProps> = () => {
  const [time, setTime] = useState(new Date());
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Burn-in protection: Small movement every 60 seconds
    const driftTimer = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 50
      });
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(driftTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(time);
  const dayName = time.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();

  return (
    <div 
      className="relative z-10 flex flex-col items-center justify-center transition-transform duration-[5000ms] ease-in-out px-4"
      style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
    >
      {/* Mobile-optimized Date Header */}
      <div className="mb-2 tracking-[0.5em] text-cyan-400 opacity-60 text-[10px] font-bold animate-pulse">
        {dayName} // {dateStr}
      </div>

      {/* Main Time Display - Responsive Sizes */}
      <div className="flex items-baseline space-x-1 sm:space-x-2">
        <span className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          {h}
        </span>
        <span className="text-5xl sm:text-7xl font-light text-cyan-400 animate-pulse opacity-80">:</span>
        <span className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          {m}
        </span>
        <div className="flex flex-col ml-2 sm:ml-4">
          <span className="text-xl sm:text-3xl font-mono text-fuchsia-500 font-bold opacity-90">
            {s}
          </span>
          <span className="text-[8px] text-cyan-500/50 font-mono tracking-widest hidden sm:block">
            MS-LINK
          </span>
        </div>
      </div>

      {/* Decorative HUD lines */}
      <div className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-6" />
      
      <div className="flex space-x-8 sm:space-x-12 mt-4 scale-90 sm:scale-100">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-600 tracking-widest uppercase font-mono">Neural_Sync</span>
          <div className="w-12 h-0.5 bg-gray-900 mt-1 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-2/3 animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-600 tracking-widest uppercase font-mono">Buffer</span>
          <span className="text-[10px] text-fuchsia-400 font-bold mt-0.5 font-mono">OK</span>
        </div>
      </div>
    </div>
  );
};

export default FuturisticClock;
