
import React, { useState, useEffect, useCallback } from 'react';
import FuturisticClock from './components/FuturisticClock';
import OrbitVisualizer from './components/OrbitVisualizer';
import Pomodoro from './components/Pomodoro';
import { getSystemStatus } from './services/geminiService';
import { SystemStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>({
    message: "CALIBRANDO NÚCLEO...",
    load: 0,
    stability: "WAIT",
    neuralLink: "SYNC"
  });
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  const fetchStatus = useCallback(async () => {
    try {
      const newStatus = await getSystemStatus();
      setStatus(newStatus);
    } catch (e) {
      console.warn("Error en telemetría local");
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);

    // Drifting sutil para prevenir quemado de píxeles (AOD Burn-in Protection)
    const driftTimer = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 30
      });
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(driftTimer);
    };
  }, [fetchStatus]);

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Visualización Orbital de Fondo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/10 via-black to-black opacity-80"></div>
        <OrbitVisualizer />
      </div>

      {/* Contenedor Principal Optimizado para Horizontal */}
      <div 
        className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-around transition-transform duration-[15000ms] ease-in-out px-4 sm:px-12"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        {/* Columna Izquierda: El Reloj */}
        <div className="flex-1 flex justify-center items-center scale-90 sm:scale-100">
          <FuturisticClock onStatusUpdate={() => {}} />
        </div>

        {/* Columna Derecha: Pomodoro Lineal */}
        <div className="flex-1 w-full max-w-lg flex justify-center items-center pt-4 lg:pt-0">
          <Pomodoro />
        </div>
      </div>

      {/* Telemetría Inferior (Always On) */}
      <div className="absolute bottom-6 w-full flex justify-between px-10 items-end z-20 opacity-30 pointer-events-none font-mono">
        <div className="flex flex-col">
          <span className="text-[8px] text-red-900 tracking-widest">AOD_PROTOCOL_ACTIVE</span>
          <span className="text-[10px] text-red-700">{status?.message}</span>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex flex-col items-end">
             <span className="text-[7px] text-red-900">CORE_LOAD</span>
             <span className="text-[9px] text-red-600 font-bold">{status?.load.toFixed(1)}%</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[7px] text-red-900">STABILITY</span>
             <span className="text-[9px] text-red-600 font-bold">{status?.stability}</span>
          </div>
        </div>
      </div>

      {/* Decoración HUD Lateral */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-40 w-[1px] bg-gradient-to-b from-transparent via-red-900/50 to-transparent opacity-20 hidden sm:block" />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 h-40 w-[1px] bg-gradient-to-b from-transparent via-red-900/50 to-transparent opacity-20 hidden sm:block" />
    </div>
  );
};

export default App;
