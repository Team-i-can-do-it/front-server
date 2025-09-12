import ResultAnalysis from '@_components/pageComponent/result/ResultAnalysis';
import ResultSummary from '@_components/pageComponent/result/ResultSummary';
import { useAnswerResult } from '@_hooks/useResult';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingPage from './LoadingPage';

type TabId = 'summary' | 'analysis';
const TABS: { id: TabId; label: string }[] = [
  { id: 'summary', label: '요약' },
  { id: 'analysis', label: '분석' },
];

// 상수(디자인 값)
const HEADER_H = 44; // 헤더 높이
const TAB_H = 27; // 탭바 높이
const TAB_W = 152; // 탭 너비
const GAP_REM = '1.25rem'; // gap-5

export default function ResultPage() {
  const [params, setParams] = useSearchParams();
  const tabParam = (params.get('tab') as TabId) || 'summary';
  const [active, setActive] = useState<TabId>(tabParam);
  const id = params.get('id') ?? '';

  useEffect(() => {
    if (!params.get('tab')) {
      const next = new URLSearchParams(params);
      next.set('tab', 'summary');
      setParams(next, { replace: true });
    } else {
      setActive(tabParam);
    }
  }, [tabParam]);

  const onTab = (tab: TabId) => {
    if (tab === active) return;
    setActive(tab);
    const next = new URLSearchParams(params);
    next.set('tab', tab);
    setParams(next, { replace: true });
  };
  const { data, isPending, isError } = useAnswerResult(id);

  if (!id) {
    return (
      <main className="min-h-[100dvh] bg-white">
        <section className="mx-auto w-[min(100vw,390px)] px-6 py-10">
          결과 ID가 없습니다.
        </section>
      </main>
    );
  }
  if (isPending) return <LoadingPage />;

  if (isError || !data) {
    return (
      <main className="min-h-[100dvh] bg-white">
        <section className="mx-auto w-[min(100vw,390px)] px-6 py-10">
          결과를 불러오지 못했어요.
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-white">
      {/* 탭바: 헤더(44px) 바로 아래 고정 + 페이지폭 390px 제한 */}
      <nav
        className="fixed z-40 bg-white border-b border-border-25
                   w-[min(100vw,390px)]"
        style={{ top: HEADER_H }}
      >
        <div
          className="relative mx-auto h-[44px] flex items-center"
          style={{ width: `calc(${TAB_W}px * 2 + ${GAP_REM})` }}
        >
          <ul className="flex w-full items-center justify-between gap-5">
            {TABS.map(({ id, label }) => (
              <li key={id} className="h-full flex items-center">
                <button
                  onClick={() => onTab(id)}
                  className={[
                    'typo-label9-sb-16 h-full w-[152px] flex items-center justify-center transition-colors cursor-pointer',
                    active === id ? 'text-text-700' : 'text-text-200',
                  ].join(' ')}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          {/* 활성 밑줄: 고정폭 + translateX로만 이동 */}
          <span
            className="pointer-events-none absolute bottom-0 h-[2px] bg-border-700 transition-transform duration-200"
            style={{
              width: TAB_W,
              transform:
                active === 'summary'
                  ? 'translateX(0)'
                  : `translateX(calc(${TAB_W}px + ${GAP_REM}))`,
            }}
          />
        </div>
      </nav>

      {/* 본문: 헤더(44) + 탭(44) 만큼 상단 패딩, 폭 390px 제한 */}
      <section
        className="mx-auto w-[min(100vw,390px)] px-6 pb-10"
        style={{ paddingTop: HEADER_H + TAB_H }}
      >
        <Suspense fallback={<LoadingPage />}>
          {active === 'summary' ? (
            <ResultSummary data={data} />
          ) : (
            <ResultAnalysis data={data} />
          )}
        </Suspense>
      </section>
    </main>
  );
}
