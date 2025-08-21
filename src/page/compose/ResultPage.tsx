import { NavLink, Outlet, useSearchParams } from 'react-router-dom';

export default function ResultPage() {
  const [sp] = useSearchParams();
  const topic = sp.get('topic') || '';
  const q = topic ? `?topic=${encodeURIComponent(topic)}` : '';

  return (
    <section className="pb-[96px]">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur">
        <div className="flex h-12 items-end gap-6 px-5 border-b border-b-[#f2f3f5]">
          <NavLink
            to={`summary${q}`}
            end
            className={({ isActive }) =>
              [
                'flex-1 h-12 -mb-px px-1 text-base text-center',
                isActive
                  ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500',
              ].join(' ')
            }
          >
            요약
          </NavLink>
          <NavLink
            to={`analysis${q}`}
            className={({ isActive }) =>
              [
                'flex-1 h-12 -mb-px px-1 text-base text-center',
                isActive
                  ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500',
              ].join(' ')
            }
          >
            분석
          </NavLink>
        </div>
      </div>

      <Outlet />

      {/* 공통 하단 액션 */}
      <div
        className="fixed left-0 right-0 bottom-0 backdrop-blur px-6"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="h-[64px] flex items-center gap-3">
          <button
            onClick={() => history.back()}
            className="w-1/2 h-11 rounded-xl border border-gray-200 font-semibold"
          >
            다시 쓰기
          </button>
          <a
            href="/home"
            className="w-1/2 h-11 rounded-xl bg-violet-500 text-white font-semibold grid place-items-center"
          >
            새 글 시작
          </a>
        </div>
      </div>
    </section>
  );
}
