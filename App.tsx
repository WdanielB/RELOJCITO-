
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
    // Carga inicial de datos mock
    const loadStatus = async () => {
      const data = await getSystemStatus();
      setStatus(data);
    };
    loadStatus();
    
    // Protección contra quemado (Burn-in protection) para pantallas OLED
    const driftInterval = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20
      });
    }, 60000);

    return () => clearInterval(driftInterval);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Visualización de fondo */}
      <div className="absolute inset-0 z-0">
        <OrbitVisualizer />
      </div>

      {/* Interfaz con desplazamiento protector sutil */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center space-y-16 transition-transform duration-[10000ms] ease-in-out"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        <FuturisticClock onStatusUpdate={() => {}} />
        
        <div className="w-64 sm:w-80">
          <Pomodoro />
        </div>
      </div>

      {/* Telemetría inferior */}
      <div className="absolute bottom-10 flex flex-col items-center opacity-30 pointer-events-none font-mono">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-[8px] tracking-[0.4em] text-red-500">AOD_LINK_ACTIVE</span>
        </div>
        <span className="text-[10px] text-red-700 uppercase">
          {status?.message || "CALIBRATING_SENSORS..."}
        </span>
      </div>
    </div>
  );
};

export default App;
