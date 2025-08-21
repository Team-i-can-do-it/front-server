import { useMemo } from 'react';

export type RadarItem = { k: string; v: number };

export default function RadarSVG({ items }: { items: RadarItem[] }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 100;
  const levels = 5;

  const angleStep = (Math.PI * 2) / items.length;

  const toPoint = (value: number, i: number, rMax = maxR) => {
    const ratio = Math.max(0, Math.min(100, value)) / 100;
    const r = ratio * rMax;
    const theta = -Math.PI / 2 + angleStep * i;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    return `${x},${y}`;
  };

  const gridPolys = useMemo(() => {
    return Array.from({ length: levels }, (_, level) => {
      const r = ((level + 1) / levels) * maxR;
      const pts = items.map((_, i) => {
        const theta = -Math.PI / 2 + angleStep * i;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        return `${x},${y}`;
      });
      return pts.join(' ');
    });
  }, [items.length]);

  const valuePoly = items.map((it, i) => toPoint(it.v, i)).join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-[260px] mx-auto"
      aria-label="레이더 차트"
    >
      {items.map((_, i) => {
        const theta = -Math.PI / 2 + angleStep * i;
        const x = cx + maxR * Math.cos(theta);
        const y = cy + maxR * Math.sin(theta);
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#E5E7EB"
          />
        );
      })}

      {gridPolys.map((pts, i) => (
        <polygon
          key={`grid-${i}`}
          points={pts}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}

      <polygon
        points={valuePoly}
        fill="rgba(124, 58, 237, 0.18)"
        stroke="#8B5CF6"
      />

      {items.map((it, i) => {
        const theta = -Math.PI / 2 + angleStep * i;
        const r = maxR + 18;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor={
              Math.cos(theta) > 0.35
                ? 'start'
                : Math.cos(theta) < -0.35
                ? 'end'
                : 'middle'
            }
            dominantBaseline={
              Math.sin(theta) > 0.35
                ? 'hanging'
                : Math.sin(theta) < -0.35
                ? 'ideographic'
                : 'middle'
            }
            fontSize="12"
            fill="#6B7280"
          >
            {it.k}
          </text>
        );
      })}
    </svg>
  );
}
