
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const OrbitVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || typeof d3 === 'undefined') return;

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('*').remove();

      const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      // Rings optimized for horizontal/landscape
      const rings = [100, 180, 280, 400];
      
      rings.forEach((radius, i) => {
        g.append('circle')
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(255, 0, 0, 0.05)')
          .attr('stroke-width', 0.5);

        const orbitG = g.append('g');
        
        orbitG.append('circle')
          .attr('r', 2 + Math.random() * 2)
          .attr('cx', radius)
          .attr('fill', i % 2 === 0 ? '#ff0000' : '#ff5500')
          .style('opacity', 0.3);

        const duration = 20000 + Math.random() * 30000;
        function repeat() {
          orbitG.transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .attrTween('transform', () => {
              const interpolate = d3.interpolate(0, 360);
              return (t) => `rotate(${interpolate(t)})`;
            })
            .on('end', repeat);
        }
        repeat();
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
      style={{ opacity: 0.4 }}
    />
  );
};

export default OrbitVisualizer;
