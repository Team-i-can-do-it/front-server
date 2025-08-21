import { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

type Sub = { k: string; v: number };

function RadarSVG({ items }: { items: Sub[] }) {
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
      aria-label="레이터 차트"
    >
      {/* 축선 */}
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

      {/* 격자 다각형 */}
      {gridPolys.map((pts, i) => (
        <polygon
          key={`grid-${i}`}
          points={pts}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}

      {/* 값 영역 */}
      <polygon
        points={valuePoly}
        fill="rgba(124, 58, 237, 0.18)"
        stroke="#8B5CF6"
      />

      {/* 라벨 */}
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

export default function ResultPage() {
  const navigate = useNavigate();
  const { mode } = useParams(); // "summary" | "analysis" 등 탭 상태 용
  const [sp] = useSearchParams();
  const topic = sp.get('topic') || '';

  // ===== 목업 데이터 (스샷과 동일 톤) =====
  const total = 90;
  const subs: Sub[] = [
    { k: '내용 충실성', v: 32 },
    { k: '표현력', v: 34 },
    { k: '완성도', v: 48 },
    { k: '주제 명료성', v: 80 },
    { k: '논리성', v: 32 },
  ];
  const feedback =
    '핵심 문장을 앞에 배치해 가독성이 좋습니다. 예시가 구체적이며, 결론이 명확합니다. 중간 연결 문장을 한두 개만 더 보완하면 더 매끄러워질 거예요.';
  const tags = ['감성형', '정보형', '차분형'];

  const activeTab = (mode || 'summary') === 'analysis' ? 'analysis' : 'summary';

  return (
    <section className="pb-[96px]">
      {/* 상단 탭 */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur">
        <div className="flex h-12 items-end gap-6 px-5 border-b border-b-[#f2f3f5]">
          <button
            className={[
              'flex-1 h-12 -mb-px px-1 text-base',
              activeTab === 'summary'
                ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500',
            ].join(' ')}
            onClick={() =>
              navigate(
                '/result/summary' +
                  (topic ? `?topic=${encodeURIComponent(topic)}` : ''),
              )
            }
          >
            요약
          </button>
          <button
            className={[
              'flex-1 h-12 -mb-px px-1 text-base',
              activeTab === 'analysis'
                ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500',
            ].join(' ')}
            onClick={() =>
              navigate(
                '/result/analysis' +
                  (topic ? `?topic=${encodeURIComponent(topic)}` : ''),
              )
            }
          >
            분석
          </button>
        </div>
      </div>

      {/* 타이틀 */}
      <div className="px-5 pt-5">
        <p className="text-base font-semibold">
          내 글쓰기 실력, 얼마나 좋을까?
        </p>

        <div className="mt-3 mb-4">
          <div className="text-sm font-semibold text-gray-400">
            도넛님의 점수는
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-4xl font-semibold">{total}점</div>
            <div className="text-lg text-violet-500 font-semibold">
              프로 직장인이에요!
            </div>
          </div>
        </div>
      </div>

      {/* 레이더 + 세부지표 카드 */}
      <div className="rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <RadarSVG items={subs} />
      </div>

      {/* 피드백 */}
      <div className=" mt-5 rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <p className="text-base font-semibold mb-2">AI 기반 맞춤 피드백</p>
        <p className="text-sm text-[#3a3a3a] leading-6">{feedback}</p>
      </div>

      {/* 성향 태그 */}
      <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-1">
          <p className="text-base font-semibold">도넛님 글쓰기 성향</p>
          <span className="text-gray-400 text-xs">ⓘ</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 h-7 inline-flex items-center rounded-full text-sm bg-violet-50 text-violet-500 border border-violet-100"
            >
              # {t}
            </span>
          ))}
        </div>
      </div>

      {/* 하단 액션 */}
      <div
        className="fixed left-0 right-0 bottom-0 backdrop-blur px-6"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="h-[64px] flex items-center gap-3">
          <button
            onClick={() => navigate('../write')}
            className="w-1/2 h-11 rounded-xl border border-gray-200 font-semibold"
          >
            다시 쓰기
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-1/2 h-11 rounded-xl bg-violet-500 text-white font-semibold"
          >
            새 글 시작
          </button>
        </div>
      </div>
    </section>
  );
}
