
import React, { useState, useEffect } from 'react';
import FuturisticClock from './components/FuturisticClock';
import OrbitVisualizer from './components/OrbitVisualizer';
import Pomodoro from './components/Pomodoro';
import { getSystemStatus } from './services/geminiService';
import { SystemStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Carga inicial de datos
    getSystemStatus().then(setStatus);
    
    // Protección contra quemado (Burn-in protection)
    // Mueve los elementos sutilmente cada 2 minutos
    const driftInterval = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30
      });
    }, 120000);

    return () => clearInterval(driftInterval);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo con órbitas sutiles */}
      <div className="absolute inset-0 z-0">
        <OrbitVisualizer />
      </div>

      {/* Contenido principal con drift protector */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center space-y-12 transition-transform duration-[10000ms] ease-in-out"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        <FuturisticClock onStatusUpdate={() => {}} />
        
        <div className="w-full max-w-xs sm:max-w-md">
          <Pomodoro />
        </div>
      </div>

      {/* Footer de sistema */}
      <div className="absolute bottom-8 flex flex-col items-center opacity-20 pointer-events-none">
        <span className="text-[8px] font-mono tracking-[0.5em] text-red-500 mb-1">STABLE_CORE_V2</span>
        <span className="text-[10px] font-mono text-red-700 uppercase">
          {status?.message || "SYNCHRONIZING..."}
        </span>
      </div>
    </div>
  );
};

export default App;
