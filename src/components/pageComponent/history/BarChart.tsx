import { useMemo } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type ChartOptions,
  type ChartData,
  type Chart,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// 100점 가이드라인 + "100점" 텍스트
const maxGuidePlugin = {
  id: 'maxGuide',
  afterDraw(chart: Chart) {
    const y = chart.scales.y?.getPixelForValue(100);
    if (y == null) return;
    const { ctx, chartArea } = chart;
    const { left, right } = chartArea;

    ctx.save();
    ctx.fillStyle = 'rgba(154,114,255,0.7)';
    ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.textBaseline = 'bottom';
    ctx.fillText('100점', left, y - 6);

    ctx.strokeStyle = 'rgba(154,114,255,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(maxGuidePlugin);

type Props = {
  values: number[]; // 일별 점수 배열 (길이=그 달의 일수)
  visibleCount?: number; // 한 화면에 보일 막대 개수 (기본 7)
  onBarClick?: (index: number) => void; // 0=1일, 1=2일...
  className?: string;
};

export default function BarChart({
  values,
  visibleCount = 7,
  onBarClick,
  className,
}: Props) {
  // 01 ~ n일
  const labels = useMemo(
    () => values.map((_, i) => String(i + 1).padStart(2, '0')),
    [values],
  );

  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels,
      datasets: [
        {
          label: '일 평균',
          data: values,
          borderRadius: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: 'bottom',
          backgroundColor: (ctx) => {
            const { chart } = ctx;
            const { ctx: g, chartArea } = chart;
            if (!chartArea) return 'rgba(154,114,255,0.6)';
            const gradient = g.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, 'rgba(154,114,255,1)');
            gradient.addColorStop(1, 'rgba(154,114,255,0.16)');
            return gradient;
          },
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [values, labels],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 }, color: '#95989C' },
        },
        y: {
          min: 0,
          max: 140,
          ticks: { display: false },
          grid: { display: false },
          border: { display: false },
        },
      },
      onClick: (_, elements) => {
        if (!onBarClick || !elements?.length) return;
        onBarClick(elements[0].index);
      },
    }),
    [onBarClick],
  );

  // 가로 스크롤: 막대 한 칸의 셀 폭(픽셀) 기준으로 내부 폭 확장
  const CELL_W = 36; // 라벨 포함 대략 한 칸
  const innerWidth = Math.max(values.length, visibleCount) * CELL_W;
  const CHART_H = 213;

  return (
    <section
      className={['w-full bg-white rounded-2xl pr-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 바깥 스크롤 래퍼와 안쪽 래퍼 모두 같은 높이 */}
      <div className="overflow-x-auto" style={{ height: CHART_H }}>
        <div style={{ width: innerWidth, height: CHART_H }}>
          <Bar
            data={data}
            options={options}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    </section>
  );
}
