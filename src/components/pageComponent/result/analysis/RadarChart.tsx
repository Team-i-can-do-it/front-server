// RadarChart.tsx
import { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

type RadarChartProps = {
  name: string;
  labels: string[];
  scores: number[];
  className?: string;
};

export default function RadarChart({
  name,
  labels,
  scores,
  className,
}: RadarChartProps) {
  const data = useMemo<ChartData<'radar'>>(
    () => ({
      labels,
      datasets: [
        {
          label: 'feedback',
          data: scores,
          fill: true,
          backgroundColor: 'rgba(141, 88, 233, 0.43)',
          borderColor: 'rgba(123,0,254,0.43)',
          borderWidth: 1,
          pointRadius: 0,
          pointBackgroundColor: '#8d58e9',
        },
      ],
    }),
    [labels, scores],
  );

  const options = useMemo<ChartOptions<'radar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        r: {
          type: 'radialLinear',
          min: 0,
          max: 100,
          ticks: { display: false },

          grid: {
            drawTicks: false,
            drawBorder: false,
            lineWidth: (ctx: any) =>
              ctx.index === ctx.scale.ticks.length - 1 ? 1 : 0,
            color: (ctx: any) =>
              ctx.index === ctx.scale.ticks.length - 1
                ? 'rgba(182,184,187,0.34)'
                : 'transparent',
          },
          angleLines: {
            display: false,
          },
          pointLabels: {
            padding: 6,
            font: { size: 14, weight: 400 },
            color: '#585C61',
          },
        },
      },
    }),
    [],
  );

  return (
    <section className={['w-full', className].filter(Boolean).join(' ')}>
      <h2 className="typo-h4-sb-16 mb-5">{name}님의 말하기 평가</h2>
      <div className="w-full h-64 mb-5">
        <Radar data={data} options={options} />
      </div>
    </section>
  );
}
