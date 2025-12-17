
import React, { useState, useEffect } from 'react';
import { SystemStatus } from '../types';

interface FuturisticClockProps {
  onStatusUpdate: (status: SystemStatus) => void;
}

const FuturisticClock: React.FC<FuturisticClockProps> = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* Fecha superior */}
      <div className="text-[10px] text-red-600 font-bold tracking-[0.6em] mb-4 opacity-50 uppercase">
        {time.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' })}
      </div>

      {/* Hora principal */}
      <div className="flex items-center space-x-4">
        <span className="text-8xl sm:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
          {h}
        </span>
        <span className="text-5xl sm:text-7xl font-light text-red-600 animate-pulse">:</span>
        <span className="text-8xl sm:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
          {m}
        </span>
        <div className="flex flex-col justify-end h-16 sm:h-24">
          <span className="text-2xl sm:text-3xl font-mono text-red-500 font-bold opacity-80">
            {s}
          </span>
        </div>
      </div>

      {/* Línea decorativa HUD */}
      <div className="mt-8 flex items-center space-x-4 w-full justify-center">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-red-600"></div>
        <div className="w-1 h-1 bg-red-600 rotate-45"></div>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-red-600"></div>
      </div>
    </div>
  );
};

export default FuturisticClock;
