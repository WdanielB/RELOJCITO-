
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

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(time);
  const day = time.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
  const dateStr = time.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center select-none">
      {/* HUD Superior */}
      <div className="mb-4 flex flex-col items-center">
        <div className="h-[1px] w-20 bg-red-600 mb-2 opacity-40"></div>
        <span className="text-[10px] text-red-500 font-bold tracking-[0.5em] animate-pulse">
          {day} / {dateStr}
        </span>
      </div>

      {/* Pantalla de Tiempo Principal */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        <div className="flex flex-col items-center">
          <span className="text-7xl sm:text-9xl font-black text-white tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {h}
          </span>
          <span className="text-[8px] text-red-900 font-mono tracking-widest mt-1">HRS_VAL</span>
        </div>

        <span className="text-4xl sm:text-6xl font-light text-red-600 animate-pulse pb-4">:</span>

        <div className="flex flex-col items-center">
          <span className="text-7xl sm:text-9xl font-black text-white tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {m}
          </span>
          <span className="text-[8px] text-red-900 font-mono tracking-widest mt-1">MIN_VAL</span>
        </div>

        <div className="flex flex-col items-start ml-2 lg:ml-4 pb-2">
          <span className="text-xl sm:text-3xl font-mono text-red-500 font-bold opacity-80 leading-none">
            {s}
          </span>
          <span className="text-[7px] text-red-900 font-mono uppercase tracking-tighter">Sync_Sec</span>
        </div>
      </div>

      {/* Barra HUD Inferior */}
      <div className="mt-6 flex items-center space-x-4">
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent to-red-600/30"></div>
        <div className="w-2 h-2 rotate-45 border border-red-600/50"></div>
        <div className="w-32 h-[1px] bg-gradient-to-l from-transparent to-red-600/30"></div>
      </div>
    </div>
  );
};

export default FuturisticClock;
