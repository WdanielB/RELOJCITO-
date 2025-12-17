
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const OrbitVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Verificación de seguridad para d3
    if (!svgRef.current || typeof d3 === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const rings = [140, 220, 320];
    
    rings.forEach((r, i) => {
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 0, 0, 0.05)')
        .attr('stroke-width', 1);

      const dot = g.append('circle')
        .attr('r', 1.5)
        .attr('cx', r)
        .attr('fill', '#ff0000')
        .attr('opacity', 0.2);

      const speed = 30000 + (i * 20000);

      const animate = () => {
        dot.transition()
          .duration(speed)
          .ease(d3.easeLinear)
          .attrTween('transform', () => {
            const interpolate = d3.interpolate(0, 360);
            return (t) => `rotate(${interpolate(t)})`;
          })
          .on('end', animate);
      };
      animate();
    });

  }, []);

  return (
    <svg 
      ref={svgRef} 
      className="absolute top-0 left-0 pointer-events-none opacity-40"
      style={{ filter: 'blur(1px)' }}
    />
  );
};

export default OrbitVisualizer;
