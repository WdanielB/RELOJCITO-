
import React, { useState, useEffect } from 'react';
import FuturisticClock from './components/FuturisticClock.tsx';
import OrbitVisualizer from './components/OrbitVisualizer.tsx';
import Pomodoro from './components/Pomodoro.tsx';
import { getSystemStatus } from './services/geminiService.ts';
import { SystemStatus } from './types.ts';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Carga inicial
    getSystemStatus().then(setStatus).catch(console.error);
    
    // OLED Burn-in protection: mueve la UI sutilmente
    const driftInterval = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30
      });
    }, 60000);

    return () => clearInterval(driftInterval);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo Orbital */}
      <div className="absolute inset-0 z-0">
        <OrbitVisualizer />
      </div>

      {/* Contenedor con Drift */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center space-y-12 transition-transform duration-[10000ms] ease-in-out"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        <FuturisticClock onStatusUpdate={() => {}} />
        
        <div className="w-64 sm:w-80 opacity-80 hover:opacity-100 transition-opacity">
          <Pomodoro />
        </div>
      </div>

      {/* Telemetría inferior estética */}
      <div className="absolute bottom-10 flex flex-col items-center opacity-30 pointer-events-none font-mono">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
          <span className="text-[9px] tracking-[0.6em] text-red-500 font-bold uppercase">System_Linked</span>
        </div>
        <div className="text-[10px] text-red-700 uppercase tracking-widest text-center max-w-[250px] leading-tight">
          {status?.message || "CALIBRATING_DATA_STREAM"}
        </div>
      </div>
    </div>
  );
};

export default App;
