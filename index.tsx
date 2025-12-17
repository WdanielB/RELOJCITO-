
import React from 'react';
import { createRoot } from 'react-dom/client';

const AODClock = () => {
  const [time, setTime] = React.useState(new Date());
  const [drift, setDrift] = React.useState({ x: 0, y: 0 });
  const [battery, setBattery] = React.useState('--');
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    // 1. Actualización de hora
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 2. Protección OLED: Desplazamiento aleatorio cada 45 segundos
    const driftTimer = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40
      });
    }, 45000);

    // 3. Sensor de batería
    const checkBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const bat = await (navigator as any).getBattery();
          setBattery(Math.floor(bat.level * 100) + '%');
          bat.addEventListener('levelchange', () => {
            setBattery(Math.floor(bat.level * 100) + '%');
          });
        } catch (e) {
          console.log("Battery API not supported");
        }
      }
    };
    checkBattery();

    // 4. Animación de fondo (Canvas nativo para evitar lag)
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = (canvas as HTMLCanvasElement).getContext('2d');
      let animationFrame;
      let angle = 0;

      const render = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        (canvas as HTMLCanvasElement).width = w;
        (canvas as HTMLCanvasElement).height = h;

        if (ctx) {
          ctx.clearRect(0, 0, w, h);
          ctx.lineWidth = 1;
          const centerX = w / 2;
          const centerY = h / 2;

          // Dibujar 3 órbitas sutiles
          [140, 240, 340].forEach((radius, i) => {
            ctx.strokeStyle = `rgba(255, 0, 0, ${0.05 + (i * 0.02)})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();

            // Partícula orbital
            const orbitAngle = angle * (1 - i * 0.25);
            const px = centerX + radius * Math.cos(orbitAngle);
            const py = centerY + radius * Math.sin(orbitAngle);
            
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });

          angle += 0.004;
          animationFrame = requestAnimationFrame(render);
        }
      };
      render();
      return () => cancelAnimationFrame(animationFrame);
    }

    return () => {
      clearInterval(timer);
      clearInterval(driftTimer);
    };
  }, []);

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />
      
      <div 
        className="flex flex-col items-center transition-transform duration-[6000ms] ease-in-out z-10"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        {/* Fecha HUD */}
        <div className="flex items-center space-x-3 mb-10 opacity-60">
          <div className="h-[1px] w-6 bg-red-900"></div>
          <span className="text-[10px] font-mono text-red-500 tracking-[0.6em] font-bold">
            {dateStr}
          </span>
          <div className="h-[1px] w-6 bg-red-900"></div>
        </div>

        {/* Reloj Principal */}
        <div className="flex items-baseline space-x-3">
          <span className="text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            {hh}
          </span>
          <span className="text-6xl font-light text-red-600 animate-pulse">:</span>
          <span className="text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            {mm}
          </span>
        </div>

        {/* Info inferior */}
        <div className="mt-6 flex flex-col items-center gap-12">
          <div className="text-2xl font-mono text-red-500 font-bold tracking-[0.3em] opacity-90">
            {ss}
          </div>
          
          <div className="flex flex-col items-center opacity-40">
            <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-red-800 to-transparent mb-3"></div>
            <div className="text-[8px] font-mono tracking-[0.5em] text-red-400 uppercase">
              SYNC_STATUS: ACTIVE // BAT: {battery}
            </div>
          </div>
        </div>
      </div>

      {/* Esquinas HUD */}
      <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-red-900 opacity-30"></div>
      <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-red-900 opacity-30"></div>
      <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-red-900 opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-red-900 opacity-30"></div>
      
      <div className="absolute bottom-6 w-full text-center">
        <span className="text-[6px] font-mono text-red-950 tracking-[1.2em] uppercase">
          Neural Interface OS v2.5 // AOD Mode
        </span>
      </div>
    </div>
  );
};

// Punto de entrada seguro
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(AODClock));
}
