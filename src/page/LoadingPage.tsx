import { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie-player';

export default function LoadingPage() {
  const [loadingDog, setLoadingDog] = useState<object>();
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 로티로딩
  useEffect(() => {
    let alive = true;
    (async () => {
      const loadingDog = await import('@_characters/dog.loading.json');
      if (!alive) return;
      setLoadingDog(loadingDog.default);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 진행바
  useEffect(() => {
    const MAX = 95; // 최대 퍼센트
    const TICK = 140; // 업데이트 주기

    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= MAX) return p;
        // 끝에 가까울수록 작게 증가
        const delta = Math.max(1, Math.round((MAX - p) * 0.05));
        const next = Math.min(MAX, p + delta);

        if (next >= MAX && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return next;
      });
    }, TICK);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // 사용 방법.
  // - 외부에서 실제 완료 시점에 setProgress(100) 호출 → 바 100% 채운 뒤 화면 전환
  //   예) useEffect(() => { if (done) setProgress(100); }, [done]);

  return (
    <main className="min-h-[80dvh] grid place-items-center px-6">
      <section className="flex flex-col items-center gap-4">
        <div className="w-44 h-44">
          {loadingDog ? (
            <Lottie
              loop
              animationData={loadingDog}
              play
              speed={1.2}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            // 로티 로딩 중 스켈레톤
            <div className="w-full h-full rounded-xl bg-brand-violet-50 animate-pulse" />
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="typo-h2-sb-20">Loading...</p>
          <p className="typo-label4-m-12 text-text-200" aria-live="polite">
            결과를 준비하고 있어요🐾🐾
          </p>
        </div>

        {/* 진행바 */}
        <div
          className="mt-2 h-2 min-w-60 rounded-full bg-brand-violet-50 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="h-full rounded-full bg-brand-violet-500 transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>
    </main>
  );
}
