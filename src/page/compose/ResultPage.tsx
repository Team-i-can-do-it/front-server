import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function ResultPage() {
  const navigate = useNavigate();
  const { mode } = useParams();
  const [sp] = useSearchParams();
  const topic = sp.get('topic') || '';

  // 목업 점수/피드백
  const total = 90;
  const subs = [
    { k: '논리성', v: 85 },
    { k: '명확성', v: 92 },
    { k: '전개', v: 88 },
    { k: '완성도', v: 95 },
  ];
  const feedback =
    '핵심 문장을 앞에 배치해 가독성이 좋습니다. 예시가 구체적이며, 결론이 명확합니다. 중간 연결 문장을 한두 개만 더 보완하면 더 매끄러워질 거예요.';

  return (
    <section>
      <div className="mt-3 mb-4">
        <div className="text-sm text-gray-400">도넛님의 점수는</div>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-semibold">{total}점</div>
          <div className="text-lg text-violet-400">프로 직장인이에요!</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <p className="text-sm font-semibold mb-2">세부 지표</p>
        <ul className="grid grid-cols-2 gap-y-2">
          {subs.map((s) => (
            <li key={s.k} className="text-sm flex justify-between">
              <span className="text-gray-500">{s.k}</span>
              <span className="font-semibold">{s.v}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <p className="text-sm font-semibold mb-2">AI 기반 맞춤 피드백</p>
        <p className="text-sm text-[#3a3a3a] leading-6">{feedback}</p>
      </div>

      {/* 하단 액션 */}
      <div
        className="fixed left-0 right-0 bottom-0 border-t bg-white/90 backdrop-blur px-6"
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
