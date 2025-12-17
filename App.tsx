
import React, { useState, useEffect } from 'react';
import FuturisticClock from './components/FuturisticClock';
import OrbitVisualizer from './components/OrbitVisualizer';
import { getSystemStatus } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    getSystemStatus().then(setStatus).catch(console.error);
    
    // Burn-in protection (desplazamiento de píxeles)
    const interval = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Capa de fondo: Órbitas */}
      <div className="absolute inset-0 z-0">
        <OrbitVisualizer />
      </div>

      {/* Capa de UI: Reloj */}
      <div 
        className="relative z-10 flex flex-col items-center transition-transform duration-[5000ms] ease-in-out"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        <FuturisticClock onStatusUpdate={() => {}} />
        
        <div className="mt-20 opacity-20">
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <div className="text-[8px] font-mono text-red-500 tracking-[1em] text-center mt-4 animate-pulse uppercase">
            {status?.message || "SYSTEM_STANDBY"}
          </div>
        </div>
      </div>

      {/* Telemetría esquinada */}
      <div className="absolute bottom-6 left-6 opacity-20 font-mono text-[8px] text-red-500 flex flex-col">
        <span>LATENCY: 14MS</span>
        <span>STATUS: {status?.stability || "NOMINAL"}</span>
      </div>
      
      <div className="absolute bottom-6 right-6 opacity-20 font-mono text-[8px] text-red-500 flex flex-col text-right">
        <span>AOD_V4_CORE</span>
        <span>NEURAL_LINK: {status?.neuralLink || "READY"}</span>
      </div>
    </div>
  );
};

export default App;
