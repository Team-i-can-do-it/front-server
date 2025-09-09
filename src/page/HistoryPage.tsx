import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HistoryListTab from '@_components/pageComponent/history/HistoryListTab';
import BarChart from '@_components/pageComponent/history/BarChart';
import { useDailyScores } from '@_hooks/useHistory';
import Iconleft from '@_icons/common/icon-left.svg?react';
import IconRight from '@_icons/common/icon-right.svg?react';

type TabId = 'topic' | 'paragraph';
const TABS: { id: TabId; label: string }[] = [
  { id: 'topic', label: '주제로 표현하기' },
  { id: 'paragraph', label: '단어로 문장 만들기' },
];

export default function HistoryPage() {
  const [params, setParams] = useSearchParams();
  const tabParam = (params.get('tab') as TabId) || 'topic';
  const [active, setActive] = useState<TabId>(tabParam);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1~12
  // 선택 월의 일별 점수
  const { data: daily = [] } = useDailyScores(active, year, month);

  useEffect(() => {
    if (!params.get('tab')) setParams({ tab: 'topic' }, { replace: true });
    else setActive(tabParam);
  }, [tabParam]);
  // 차트
  const chartWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chartWrapRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      console.debug('[HistoryPage] chart wrapper size', r.width, r.height);
    }
  }, [active, year, month]);

  const onTab = (id: TabId) => {
    if (id === active) return;
    setActive(id);
    setParams({ tab: id });
  };

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1); // -1월
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };
  const nextMonth = () => {
    const d = new Date(year, month, 1); // +1월
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };

  const monthText = useMemo(() => `${month}월`, [month]);

  // 그래프 더미데이터
  const daysInMonth = useMemo(
    () => new Date(year, month, 0).getDate(),
    [year, month],
  );

  // 목 데이터: 40~95 사이에서 완만한 곡선 + 약간의 요일 노이즈
  const mockDaily = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => {
        const t = (i + 1) / daysInMonth; // 0..1
        const base = 65 + 25 * Math.sin(Math.PI * t); // 40~90대
        const noise = (((i * 7 + month * 3) % 11) - 5) * 1.5; // -7.5..+7.5
        const v = Math.round(base + noise);
        return Math.max(5, Math.min(98, v));
      }),
    [daysInMonth, month],
  );

  const chartValues = (daily?.length ?? 0) > 0 ? daily! : mockDaily;

  useEffect(() => {
    console.debug(
      '[HistoryPage] chartValues len',
      chartValues.length,
      chartValues.slice(0, 7),
    );
    (window as any).chartValues = chartValues; // 필요하면 전역으로 붙여서 콘솔에서 확인
  }, [chartValues]);

  return (
    <main className="min-h-[100dvh] w-[min(100vw,390px)] ">
      <section className="px-6 pb-10 pt-5">
        <p className="typo-h3-sb-18 mb-3">내 성장 리포트</p>
        {/* 상단 월 네비 + 일별 차트 */}
        <div className="mb-2 flex items-center justify-center gap-1">
          <button
            onClick={prevMonth}
            aria-label="이전 달"
            className="p-1 text-text-300"
          >
            <Iconleft className="w-6 h-6 cursor-pointer text-icon-200 [&_*]:fill-current [&_*]:stroke-current" />
          </button>
          <p className="typo-h2-sb-20">{monthText}</p>
          <button
            onClick={nextMonth}
            aria-label="다음 달"
            className="p-1 text-text-300"
          >
            <IconRight className="w-6 h-6 cursor-pointer text-icon-200 [&_*]:fill-current [&_*]:stroke-current" />
          </button>
        </div>
        <BarChart
          values={chartValues}
          visibleCount={7}
          onBarClick={(i) => console.log(`${i + 1}일 막대 클릭`)}
          className="mb-6"
        />

        {/* sticky 탭바 (헤더 아래에 붙음) */}
        <nav className="sticky top-[44px] z-40 bg-white border-b border-border-25">
          <div className="relative h-[44px] w-full flex items-center">
            <ul className="grid grid-cols-2 w-full">
              {TABS.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => onTab(id)}
                    className={[
                      'cursor-pointer typo-label9-sb-16 h-11 w-full flex items-center justify-center transition-colors',
                      active === id ? 'text-text-700' : 'text-text-200',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            {/* 활성 밑줄: 50% 폭 + 0%/100% 이동 */}
            <span
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-border-700 transition-transform duration-200"
              style={{
                width: '50%',
                transform:
                  active === 'topic' ? 'translateX(0%)' : 'translateX(100%)',
              }}
            />
          </div>
        </nav>

        {/* 리스트 */}
        <Suspense
          fallback={<div className="animate-pulse mt-4">불러오는 중…</div>}
        >
          <div className="mt-4">
            <HistoryListTab type={active} />
          </div>
        </Suspense>
      </section>
    </main>
  );
}
