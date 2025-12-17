
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

      // Mobile friendly rings (fewer rings for performance)
      const rings = [80, 150, 230, 320];
      
      rings.forEach((radius, i) => {
        g.append('circle')
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(0, 255, 255, 0.04)')
          .attr('stroke-width', 0.5);

        const orbitG = g.append('g');
        
        orbitG.append('circle')
          .attr('r', 1.5 + Math.random() * 2)
          .attr('cx', radius)
          .attr('fill', i % 2 === 0 ? '#00FFFF' : '#FF00FF')
          .style('opacity', 0.4);

        const duration = 15000 + Math.random() * 25000;
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
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);

  }, []);

  return (
    <svg 
      ref={svgRef} 
      className="absolute top-0 left-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
};

export default OrbitVisualizer;
