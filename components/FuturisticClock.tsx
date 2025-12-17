
import React, { useState, useEffect } from 'react';

const FuturisticClock: React.FC<{ onStatusUpdate: any }> = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[10px] text-red-600 font-bold tracking-[0.5em] mb-8 opacity-40 uppercase">
        {time.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'short' })}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-8xl sm:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
          {h}
        </span>
        <span className="text-5xl font-thin text-red-700 animate-pulse">:</span>
        <span className="text-8xl sm:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
          {m}
        </span>
      </div>
      
      <div className="mt-4 flex items-center justify-center w-full">
         <span className="text-xl font-mono text-red-500 opacity-60 font-bold">{s}</span>
      </div>
    </div>
  );
};

export default FuturisticClock;
