'use client';

import { useEffect, useRef } from 'react';

interface SankeyProps {
  data: {
    revenue: number;
    adSpend: number;
    cogs: number;
    shipping: number;
    fees: number;
    netProfit: number;
  };
}

export function SankeyDiagram({ data }: SankeyProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = 400;

    svg.innerHTML = ''; // Clear previous

    const { revenue, adSpend, cogs, shipping, fees, netProfit } = data;

    // Calculate flows
    const totalOutflow = adSpend + cogs + shipping + fees;
    const scale = (height - 100) / revenue;

    // Node positions
    const nodes = [
      { id: 'revenue', x: 50, y: height / 2, height: revenue * scale, label: `Revenue\n$${(revenue / 1000).toFixed(1)}K`, color: '#2ed573' },
      { id: 'adSpend', x: width * 0.4, y: 50, height: adSpend * scale, label: `Ad Spend\n$${(adSpend / 1000).toFixed(1)}K`, color: '#4da6ff' },
      { id: 'cogs', x: width * 0.4, y: 120 + adSpend * scale, height: cogs * scale, label: `COGS\n$${(cogs / 1000).toFixed(1)}K`, color: '#ff9f43' },
      { id: 'shipping', x: width * 0.4, y: 140 + (adSpend + cogs) * scale, height: shipping * scale, label: `Shipping\n$${(shipping / 1000).toFixed(1)}K`, color: '#ff6b9d' },
      { id: 'fees', x: width * 0.4, y: 160 + (adSpend + cogs + shipping) * scale, height: fees * scale, label: `Fees\n$${(fees / 1000).toFixed(1)}K`, color: '#a855f7' },
      { id: 'netProfit', x: width - 100, y: height / 2 - (netProfit * scale) / 2, height: netProfit * scale, label: `Net Profit\n$${(netProfit / 1000).toFixed(1)}K`, color: '#2ed573' },
    ];

    // Draw flows (bezier curves)
    const drawFlow = (from: typeof nodes[0], to: typeof nodes[0], value: number, color: string) => {
      const fromY = from.y + from.height / 2;
      const toY = to.y + to.height / 2;
      const flowHeight = value * scale;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${from.x + 120} ${fromY - flowHeight / 2}
                 C ${(from.x + to.x) / 2} ${fromY - flowHeight / 2},
                   ${(from.x + to.x) / 2} ${toY - flowHeight / 2},
                   ${to.x - 20} ${toY - flowHeight / 2}
                 L ${to.x - 20} ${toY + flowHeight / 2}
                 C ${(from.x + to.x) / 2} ${toY + flowHeight / 2},
                   ${(from.x + to.x) / 2} ${fromY + flowHeight / 2},
                   ${from.x + 120} ${fromY + flowHeight / 2}
                 Z`;

      path.setAttribute('d', d);
      path.setAttribute('fill', color);
      path.setAttribute('opacity', '0.3');
      svg.appendChild(path);
    };

    // Draw flows
    drawFlow(nodes[0], nodes[1], adSpend, nodes[1].color);
    drawFlow(nodes[0], nodes[2], cogs, nodes[2].color);
    drawFlow(nodes[0], nodes[3], shipping, nodes[3].color);
    drawFlow(nodes[0], nodes[4], fees, nodes[4].color);

    // Draw net profit flow
    const netPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const netFromY = nodes[0].y;
    const netToY = nodes[5].y + nodes[5].height / 2;
    const netHeight = netProfit * scale;
    const netD = `M ${nodes[0].x + 120} ${netFromY - netHeight / 2}
                  C ${(nodes[0].x + nodes[5].x) / 2} ${netFromY - netHeight / 2},
                    ${(nodes[0].x + nodes[5].x) / 2} ${netToY - netHeight / 2},
                    ${nodes[5].x - 20} ${netToY - netHeight / 2}
                  L ${nodes[5].x - 20} ${netToY + netHeight / 2}
                  C ${(nodes[0].x + nodes[5].x) / 2} ${netToY + netHeight / 2},
                    ${(nodes[0].x + nodes[5].x) / 2} ${netFromY + netHeight / 2},
                    ${nodes[0].x + 120} ${netFromY + netHeight / 2}
                  Z`;
    netPath.setAttribute('d', netD);
    netPath.setAttribute('fill', nodes[5].color);
    netPath.setAttribute('opacity', '0.3');
    svg.appendChild(netPath);

    // Draw nodes
    nodes.forEach((node) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', node.x.toString());
      rect.setAttribute('y', (node.y - node.height / 2).toString());
      rect.setAttribute('width', '100');
      rect.setAttribute('height', node.height.toString());
      rect.setAttribute('rx', '4');
      rect.setAttribute('fill', node.color);
      rect.setAttribute('opacity', '0.8');
      svg.appendChild(rect);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (node.x + 50).toString());
      text.setAttribute('y', node.y.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-weight', '600');
      node.label.split('\n').forEach((line, i) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', (node.x + 50).toString());
        tspan.setAttribute('dy', i === 0 ? '0' : '14');
        tspan.textContent = line;
        text.appendChild(tspan);
      });
      svg.appendChild(text);
    });
  }, [data]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '400px',
        background: 'transparent',
      }}
    />
  );
}
