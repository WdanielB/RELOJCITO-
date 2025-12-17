
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

// --- VISUALIZADOR DE ORBITAS (D3) ---
const OrbitVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const rings = [140, 220, 300];
    rings.forEach((r, i) => {
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 0, 0, 0.08)')
        .attr('stroke-width', 1);

      const dot = g.append('circle')
        .attr('r', 1.5)
        .attr('cx', r)
        .attr('fill', '#ff0000')
        .attr('opacity', 0.4);

      const speed = 15000 + (i * 12000);
      const animate = () => {
        dot.transition()
          .duration(speed)
          .ease(d3.easeLinear)
          .attrTween('transform', () => {
            const interpolate = d3.interpolate(0, 360);
            return (t: number) => `rotate(${interpolate(t)})`;
          })
          .on('end', animate);
      };
      animate();
    });
  }, []);

  return <svg ref={svgRef} className="absolute inset-0 pointer-events-none opacity-40" />;
};

// --- COMPONENTE PRINCIPAL ---
const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  const [battery, setBattery] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Pixel Shift (Protección OLED)
    const driftTimer = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15
      });
    }, 30000);

    // Detección de batería
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        setBattery(Math.floor(bat.level * 100));
        bat.addEventListener('levelchange', () => setBattery(Math.floor(bat.level * 100)));
      });
    }

    return () => {
      clearInterval(timer);
      clearInterval(driftTimer);
    };
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      <OrbitVisualizer />

      {/* Interfaz Principal */}
      <div 
        className="relative z-10 flex flex-col items-center transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
      >
        {/* Fecha y Estado Superior */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-[1px] w-8 bg-red-900"></div>
          <span className="text-[10px] font-mono text-red-600 tracking-[0.6em] font-bold">
            {dateStr}
          </span>
          <div className="h-[1px] w-8 bg-red-900"></div>
        </div>

        {/* Gran Reloj Digital */}
        <div className="flex items-baseline space-x-2">
          <span className="text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            {hours}
          </span>
          <span className="text-5xl font-light text-red-600 animate-pulse">:</span>
          <span className="text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            {minutes}
          </span>
        </div>

        {/* Segundero y Batería */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-2xl font-mono text-red-500 font-bold tracking-widest opacity-80">
            {seconds}
          </span>
          
          <div className="mt-16 flex flex-col items-center opacity-30">
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent mb-4"></div>
            <div className="text-[8px] font-mono tracking-[0.8em] text-red-400">
              CORE_SYSTEM_ACTIVE // BAT_{battery ?? '--'}%
            </div>
          </div>
        </div>
      </div>

      {/* Decoración HUD esquinas */}
      <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-red-900 opacity-20"></div>
      <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-red-900 opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-red-900 opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-red-900 opacity-20"></div>

      <div className="absolute bottom-6 text-[7px] font-mono text-red-900 tracking-[1.5em] opacity-20 uppercase">
        Nova Quantum Interface V5
      </div>
    </div>
  );
};

export default App;
