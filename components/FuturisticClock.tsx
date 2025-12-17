
import React, { useState, useEffect } from 'react';
import { SystemStatus } from '../types';

interface FuturisticClockProps {
  onStatusUpdate: (status: SystemStatus) => void;
}

const FuturisticClock: React.FC<FuturisticClockProps> = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(time);
  const dayName = time.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
  const dateStr = time.toLocaleDateString('es-ES', { month: 'short', day: '2-digit' }).toUpperCase();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 select-none">
      {/* Date Header */}
      <div className="mb-2 tracking-[0.5em] text-red-600 opacity-60 text-[10px] font-bold animate-pulse">
        {dayName} // {dateStr}
      </div>

      {/* Main Time Display */}
      <div className="flex items-baseline space-x-2 sm:space-x-4">
        <span className="text-8xl sm:text-9xl md:text-[12rem] font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(220,38,38,0.4)]">
          {h}
        </span>
        <span className="text-6xl sm:text-8xl font-light text-red-500 animate-pulse opacity-80">:</span>
        <span className="text-8xl sm:text-9xl md:text-[12rem] font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(220,38,38,0.4)]">
          {m}
        </span>
        <div className="flex flex-col ml-3">
          <span className="text-2xl sm:text-4xl font-mono text-red-600 font-bold opacity-90">
            {s}
          </span>
          <span className="text-[10px] text-red-900 font-mono tracking-widest uppercase">
            Sec_Link
          </span>
        </div>
      </div>

      {/* HUD Lines */}
      <div className="w-full max-w-[300px] h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent mt-8" />
      
      <div className="flex space-x-12 mt-6">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-red-900 tracking-widest uppercase font-mono">Thermal_Core</span>
          <div className="w-16 h-1 bg-red-950 mt-1 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 w-3/4 animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-red-900 tracking-widest uppercase font-mono">Signal</span>
          <span className="text-[10px] text-red-500 font-bold mt-0.5 font-mono">NOMINAL</span>
        </div>
      </div>
    </div>
  );
};

export default FuturisticClock;
