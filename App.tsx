
import React, { useState, useEffect, useCallback } from 'react';
import FuturisticClock from './components/FuturisticClock';
import OrbitVisualizer from './components/OrbitVisualizer';
import Pomodoro from './components/Pomodoro';
import { getSystemStatus } from './services/geminiService';
import { SystemStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  const fetchStatus = useCallback(async () => {
    try {
      const newStatus = await getSystemStatus();
      setStatus(newStatus);
    } catch (e) {
      console.error("Fallo al actualizar status");
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error de pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 300000);

    // Protección de quemado (Burn-in) global
    const driftTimer = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40
      });
    }, 120000);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      clearInterval(interval);
      clearInterval(driftTimer);
    };
  }, [fetchStatus]);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden font-['Orbitron']">
      {/* Capa de Fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/10 via-black to-black"></div>
        <OrbitVisualizer />
      </div>

      {/* Interfaz de Usuario con Drift AOD */}
      <div 
        className="relative z-10 w-full flex flex-col items-center transition-transform duration-[10000ms] ease-in-out px-10"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        {/* Pomodoro Superior Horizontal */}
        <Pomodoro />

        {/* Reloj Central imponente */}
        <FuturisticClock onStatusUpdate={setStatus} />
      </div>

      {/* Footer de datos técnicos */}
      <div className="absolute bottom-8 w-full flex flex-col items-center z-20 px-6 opacity-40">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#ff0000]" />
          <span className="text-[8px] text-red-900 font-mono tracking-[0.3em]">SYSTEM_STABLE_AOD</span>
        </div>
        <p className="font-mono text-[9px] text-red-700 uppercase tracking-tighter">
          {status?.message || "CALIBRANDO_MATRIZ_DE_PLASMA..."}
        </p>
      </div>

      {/* Botón de Interfaz */}
      <button 
        onClick={toggleFullscreen}
        className="absolute bottom-6 right-6 z-50 p-2 border border-red-900/40 rounded bg-red-950/5 hover:bg-red-900/20 active:scale-90 transition-all"
      >
        <span className="text-[7px] text-red-600 font-mono tracking-widest uppercase">
          {isFullscreen ? "LOCK" : "DEPLOY"}
        </span>
      </button>

      {/* Monitores laterales (sólo decorativos para el look futurista) */}
      <div className="absolute top-6 left-6 hidden sm:flex flex-col space-y-1 opacity-20">
         <div className="text-[7px] text-red-500 font-mono">LAT: 37.77 / LON: -122.41</div>
         <div className="text-[7px] text-red-500 font-mono">CORE_TEMP: 32.4°C</div>
      </div>
    </div>
  );
};

export default App;
