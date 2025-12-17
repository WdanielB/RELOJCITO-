
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const OrbitVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('*').remove();

      const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      // Configuración de anillos orbitales sutiles
      const rings = [
        { r: 150, speed: 40000, opacity: 0.03 },
        { r: 250, speed: 60000, opacity: 0.02 },
        { r: 350, speed: 80000, opacity: 0.02 },
        { r: 500, speed: 120000, opacity: 0.01 }
      ];
      
      rings.forEach((ring, i) => {
        // El círculo de la órbita
        g.append('circle')
          .attr('r', ring.r)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(255, 0, 0, ' + ring.opacity + ')')
          .attr('stroke-width', 1);

        // El "satélite" o punto de datos
        const orbitG = g.append('g');
        
        orbitG.append('circle')
          .attr('r', 1.5)
          .attr('cx', ring.r)
          .attr('fill', '#ff0000')
          .style('opacity', 0.2);

        function animateOrbit() {
          orbitG.transition()
            .duration(ring.speed)
            .ease(d3.easeLinear)
            .attrTween('transform', () => {
              const interpolate = d3.interpolate(0, 360);
              return (t) => `rotate(${interpolate(t)})`;
            })
            .on('end', animateOrbit);
        }
        animateOrbit();
      });
    };

    render();
    const handleResize = () => render();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return (
    <svg 
      ref={svgRef} 
      className="absolute top-0 left-0 pointer-events-none"
      style={{ filter: 'blur(1px)' }}
    />
  );
};

export default OrbitVisualizer;
