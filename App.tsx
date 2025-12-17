
import React, { useState, useEffect } from 'react';
import FuturisticClock from './components/FuturisticClock.tsx';
import OrbitVisualizer from './components/OrbitVisualizer.tsx';
import { getSystemStatus } from './services/geminiService.ts';
import { SystemStatus } from './types.ts';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("APP_CORE: Iniciando servicios de telemetría...");
    
    getSystemStatus()
      .then(setStatus)
      .catch(err => {
        console.error("APP_CORE: Error en status:", err);
        setError("STATUS_LINK_FAILED");
      });
    
    const driftInterval = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40
      });
    }, 120000);

    return () => clearInterval(driftInterval);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Capa 0: Visualizador Orbital */}
      <div className="absolute inset-0 z-0">
        <OrbitVisualizer />
      </div>

      {/* Capa 1: Reloj y HUD Principal */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center transition-transform duration-[10000ms] ease-in-out"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        <FuturisticClock onStatusUpdate={() => {}} />
        
        {/* Placeholder para el Pomodoro si se desea reintroducir después de validar el core */}
        <div className="mt-12 h-20 flex items-center justify-center">
          <div className="text-[10px] font-mono text-red-900 tracking-[0.4em] animate-pulse">
            {error ? `ERROR: ${error}` : 'SCANNING_NEURAL_PATTERNS...'}
          </div>
        </div>
      </div>

      {/* Telemetría inferior */}
      <div className="absolute bottom-10 flex flex-col items-center opacity-40 pointer-events-none font-mono">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
          <span className="text-[9px] tracking-[0.5em] text-red-500 font-bold uppercase">NOVA_AOD_CONNECTED</span>
        </div>
        <div className="text-[10px] text-red-700 uppercase tracking-widest text-center">
          {status?.message || "SYNCHRONIZING_CORE_V3"}
        </div>
      </div>
    </div>
  );
};

export default App;
