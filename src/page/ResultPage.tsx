import ResultAnalysis from '@_components/pageComponent/result/ResultAnalysis';
import ResultSummary from '@_components/pageComponent/result/ResultSummary';
import { useSearchParams } from 'react-router-dom';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useAnswerResult, useParagraphResult } from '@_hooks/useResult';
import FullscreenConfetti from '@/components/common/Confetti';

type TabId = 'summary' | 'analysis';
const TABS = [
  { id: 'summary' as const, label: '요약' },
  { id: 'analysis' as const, label: '분석' },
];

const HEADER_H = 44;
const TAB_H = 27;
const TAB_W = 152;
const GAP_REM = '1.25rem';

export default function ResultPage() {
  const [params, setParams] = useSearchParams();
  const id = params.get('id') ?? '';
  const type = (params.get('type') ?? 'writing') as 'writing' | 'paragraph';
  const tabParam = (params.get('tab') as TabId) || 'summary';
  const [active, setActive] = useState<TabId>(tabParam);

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

  if (!id) {
    return (
      <main className="min-h-[100dvh] bg-white">
        <section className="mx-auto w-[min(100vw,390px)] px-6 py-10">
          결과 ID가 없습니다.
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-white">
      <nav
        className="fixed z-40 bg-white border-b border-border-25 w-[min(100vw,390px)]"
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

      <section
        className="mx-auto w-[min(100vw,390px)] px-6 pb-10"
        style={{ paddingTop: HEADER_H + TAB_H }}
      >
        <Suspense>
          {type === 'paragraph' ? (
            <ParagraphResultBody id={id} active={active} />
          ) : (
            <WritingResultBody id={id} active={active} />
          )}
        </Suspense>
      </section>
    </main>
  );
}

function WritingResultBody({ id, active }: { id: string; active: TabId }) {
  const { data, isError } = useAnswerResult(id);
  // 결과가 성공적으로 로드되었을 때 한 번만 빵빠레
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (!isError) {
      const t = setTimeout(() => setOpen(false), 1600);
      return () => clearTimeout(t);
    }
  }, [id, isError]);

  if (isError || !data) return <ErrorBlock />;

  return (
    <>
      <FullscreenConfetti open={open} onClose={() => setOpen(false)} />
      {active === 'summary' ? (
        <ResultSummary data={data} />
      ) : (
        <ResultAnalysis data={data} />
      )}
    </>
  );
}

function ParagraphResultBody({ id, active }: { id: string; active: TabId }) {
  const { data, isPending, isError } = useParagraphResult(id);
  const [open, setOpen] = useState(false);
  const ready = useMemo(
    () => !isPending && !isError && !!data,
    [isPending, isError, data],
  );

  useEffect(() => {
    if (ready) {
      setOpen(true);
      const t = setTimeout(() => setOpen(false), 1600);
      return () => clearTimeout(t);
    }
  }, [ready, id]);

  if (isError || !data) return <ErrorBlock />;

  return (
    <>
      <FullscreenConfetti open={open} onClose={() => setOpen(false)} />
      {active === 'summary' ? (
        <ResultSummary data={data} />
      ) : (
        <ResultAnalysis data={data} />
      )}
    </>
  );
}

function ErrorBlock() {
  return (
    <section className="mx-auto w-[min(100vw,390px)] px-6 py-10">
      결과를 불러오지 못했어요.
    </section>
  );
}
