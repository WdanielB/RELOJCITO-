
import React, { useState, useEffect, useCallback } from 'react';
import FuturisticClock from './components/FuturisticClock';
import OrbitVisualizer from './components/OrbitVisualizer';
import Pomodoro from './components/Pomodoro';
import { getSystemStatus } from './services/geminiService';
import { SystemStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>({
    message: "INICIALIZANDO SISTEMA...",
    load: 0,
    stability: "WAIT",
    neuralLink: "CONNECTING"
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  const fetchStatus = useCallback(async () => {
    try {
      const newStatus = await getSystemStatus();
      setStatus(newStatus);
    } catch (e) {
      console.warn("Error al actualizar estado local");
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
    const interval = setInterval(fetchStatus, 60000); // Actualiza cada minuto

    // Protección de quemado (Burn-in) global suave
    const driftTimer = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30
      });
    }, 120000);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      clearInterval(interval);
      clearInterval(driftTimer);
    };
  }, [fetchStatus]);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo con visualizador orbital */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/10 via-black to-black"></div>
        <OrbitVisualizer />
      </div>

      {/* Interfaz Principal con protección Burn-in */}
      <div 
        className="relative z-10 w-full flex flex-col items-center transition-transform duration-[10000ms] ease-in-out px-10"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        {/* Pomodoro Horizontal Lineal */}
        <Pomodoro />

        {/* Reloj Central */}
        <FuturisticClock onStatusUpdate={setStatus} />
      </div>

      {/* Footer Informativo */}
      <div className="absolute bottom-10 w-full flex flex-col items-center z-20 px-6 opacity-30 pointer-events-none">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#ff0000]" />
          <span className="text-[10px] text-red-900 font-mono tracking-[0.4em]">CORE_AOD_v2.0</span>
        </div>
        <div className="max-w-md border-t border-red-950/30 pt-2 text-center">
          <p className="font-mono text-[10px] text-red-700 uppercase tracking-widest leading-none">
            {status?.message}
          </p>
        </div>
      </div>

      {/* Botón de Control (Invisible en AOD, visible al tocar) */}
      <button 
        onClick={toggleFullscreen}
        className="absolute bottom-6 right-6 z-50 p-3 border border-red-900/20 rounded-full bg-black/20 backdrop-blur-sm opacity-10 hover:opacity-100 transition-opacity"
      >
        <span className="text-[8px] text-red-600 font-mono uppercase tracking-tighter">
          {isFullscreen ? "LOCK" : "DEPLOY"}
        </span>
      </button>

      {/* Telemetría Lateral Decorativa */}
      <div className="absolute top-10 left-10 hidden lg:flex flex-col space-y-2 opacity-10 font-mono text-[8px] text-red-500">
         <div>[ GRID_SYNC: 60Hz ]</div>
         <div>[ CORE_LOAD: {status?.load.toFixed(1)}% ]</div>
         <div>[ STATUS: {status?.stability} ]</div>
      </div>
    </div>
  );
};

export default App;
