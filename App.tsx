
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

  const fetchStatus = async () => {
    const newStatus = await getSystemStatus();
    setStatus(newStatus);
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
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

    const driftTimer = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 30
      });
    }, 120000);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      clearInterval(interval);
      clearInterval(driftTimer);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/5 via-black to-black"></div>
        <OrbitVisualizer />
      </div>

      {/* Main UI Container with Drift */}
      <div 
        className="relative z-10 w-full flex flex-col items-center transition-transform duration-[8000ms] ease-in-out"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        {/* Top Module: Pomodoro (Horizontal redesigned) */}
        <Pomodoro />

        {/* Center Module: Clock */}
        <FuturisticClock onStatusUpdate={setStatus} />
      </div>

      {/* Neural Feed Footer */}
      <div className="absolute bottom-10 sm:bottom-12 w-full flex flex-col items-center z-20 px-6 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse shadow-[0_0_5px_#ff0000]" />
          <span className="text-[8px] sm:text-[10px] text-red-900 font-mono tracking-widest">AOD_STREAM_CONNECTED</span>
        </div>
        <div className="max-w-xs sm:max-w-md text-center">
          <p className="font-mono text-[10px] text-red-500/70 tracking-tight uppercase">
            {status?.message || "CALIBRATING_QUANTUM_FIELD..."}
          </p>
        </div>
      </div>

      {/* Fullscreen Button */}
      <button 
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-50 p-2 border border-red-500/20 rounded bg-black/40 backdrop-blur-sm active:scale-95 transition-all"
      >
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-red-500 font-mono tracking-tighter uppercase">
            {isFullscreen ? "LOCK_AOD" : "DEPLOY_INTERFACE"}
          </span>
          <div className="w-4 h-[1px] bg-red-500/50 mt-1" />
        </div>
      </button>

      {/* Status Indicators Top Right */}
      <div className="absolute top-4 right-4 flex items-center space-x-1.5 opacity-40">
        <div className="text-[8px] font-mono text-red-500 mr-2">{status?.load.toFixed(0) || "0"}%</div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-2 h-0.5 rounded-full ${i < 4 ? 'bg-red-500' : 'bg-gray-800'}`} />
        ))}
      </div>
    </div>
  );
};

export default App;
