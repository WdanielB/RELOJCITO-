
import React, { useState, useEffect, useCallback } from 'react';
import FuturisticClock from './components/FuturisticClock';
import OrbitVisualizer from './components/OrbitVisualizer';
import { getSystemStatus } from './services/geminiService';
import { SystemStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const interval = setInterval(fetchStatus, 300000); // 5 mins status update for mobile battery
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black"></div>
        <OrbitVisualizer />
      </div>

      {/* Main UI Layer */}
      <FuturisticClock onStatusUpdate={setStatus} />

      {/* Neural Feed Footer - Adjusted for Mobile Safe Areas */}
      <div className="absolute bottom-10 sm:bottom-12 w-full flex flex-col items-center z-20 px-6 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[8px] sm:text-[10px] text-gray-600 font-mono tracking-widest">AOD_STREAM_CONNECTED</span>
        </div>
        <div className="max-w-xs sm:max-w-md text-center">
          <p className="font-mono text-[10px] text-cyan-400/70 tracking-tight uppercase">
            {status?.message || "CALIBRATING_QUANTUM_FIELD..."}
          </p>
        </div>
      </div>

      {/* Corner UI Elements - Hidden or minimized on small mobile */}
      <div className="absolute top-10 left-10 opacity-20 hidden sm:block">
        <div className="flex flex-col font-mono text-[9px] text-cyan-400">
          <span>NOVA_MOBILE_OS</span>
          <span>S_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
        </div>
      </div>

      {/* Fullscreen Button - Critical for Mobile AOD experience */}
      <button 
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-50 p-2 border border-cyan-500/20 rounded bg-black/40 backdrop-blur-sm active:scale-95 transition-all"
      >
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-cyan-400 font-mono tracking-tighter uppercase">
            {isFullscreen ? "LOCK_AOD" : "DEPLOY_INTERFACE"}
          </span>
          <div className="w-4 h-[1px] bg-cyan-500/50 mt-1" />
        </div>
      </button>

      {/* Status Bar Top Right - Mobile Style */}
      <div className="absolute top-4 right-4 flex items-center space-x-1.5 opacity-40">
        <div className="text-[8px] font-mono text-cyan-500 mr-2">{status?.load.toFixed(0) || "0"}%</div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-2 h-0.5 rounded-full ${i < 4 ? 'bg-cyan-500' : 'bg-gray-800'}`} />
        ))}
      </div>
    </div>
  );
};

export default App;
