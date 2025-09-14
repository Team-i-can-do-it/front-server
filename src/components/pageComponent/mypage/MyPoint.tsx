import IconPoint from '@_icons/common/icon-point.svg?react';
import { useMyPoint } from '@_hooks/useMyPoint';
import { useMyPage } from '@_hooks/useMyPage';
import { useToast } from '@_hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@_store/authStore';

export default function MyPoint() {
  const {
    data: mpData,
    isLoading: mpLoading,
    isError: mpError,
    error: mpErr,
  } = useMyPage();
  const {
    data: ptData,
    isLoading: ptLoading,
    isError: ptError,
    error: ptErr,
  } = useMyPoint();

  const clearAuth = useAuthStore((s) => s.clear);
  const navigate = useNavigate();
  const toast = useToast();

  if (mpLoading || ptLoading) {
    return (
      <main className="pt-[18px] pb-[92px] bg-white-base">
        <div className="animate-pulse border-b border-border-25 py-3 mb-6">
          <div className="h-4 w-16 bg-bg-10 mb-2 rounded" />
          <div className="h-8 w-40 bg-bg-10 rounded" />
        </div>
        <ul className="space-y-4 px-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="h-12 bg-bg-10 rounded" />
          ))}
        </ul>
      </main>
    );
  }

  if (mpError || ptError) {
    // @ts-ignore axios 에러 간단 가드
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      navigate('/welcome', { replace: true });
      toast('로그인이 필요합니다.', 'error');
      return null;
    }

    return (
      <main className="pt-[18px] pb-[92px] bg-white-base">
        <div className="p-6 text-center text-status-danger">
          포인트 정보를 불러오지 못했습니다.
        </div>
      </main>
    );
  }

  const myPoint = mpData?.point ?? ptData?.point ?? 0;
  const histories = ptData?.histories ?? [];

  return (
    <main className="pt-[18px] pb-[92px] bg-white-base">
      {/* 포인트영역 */}
      <div className="flex flex-col items-start gap-[7px] border-b border-border-25 py-3 mb-6 bg-white-base px-2">
        <p className="typo-label2-r-14 text-text-700">내 포인트</p>
        <div className="flex items-center justify-center">
          <IconPoint className="size-6" />
          <h1 className="typo-h0-b-32 text-brand-violet-500">
            {myPoint.toLocaleString('ko-KR')}{' '}
            <span className="typo-label2-r-14 text-text-700">point</span>
          </h1>
        </div>
      </div>

      {/* 포인트 내역 */}
      <section className="flex flex-col gap-4 px-2">
        <div>
          <h2 className="typo-h4-sb-16 text-text-700 mb-3">내 포인트 내역</h2>
        </div>

        {histories.length === 0 ? (
          <p className="typo-body2-r-16 text-text-500 px-1">
            포인트 내역이 없습니다.
          </p>
        ) : (
          <ul className="space-y-6">
            {histories.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl p-3"
              >
                <div className="flex gap-6">
                  <p className="typo-label4-r-12 text-text-200">{item.date}</p>
                  <p className="typo-h4-sb-16 text-text-700">{item.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-[10px]">
                  <p
                    className={[
                      'typo-label3-m-14',
                      item.amount > 0
                        ? 'text-brand-violet-500'
                        : 'text-text-700',
                    ].join(' ')}
                  >
                    {item.amount > 0 ? '+' : ''}
                    {item.amount.toLocaleString('ko-KR')}
                  </p>
                  <p className="typo-label2-r-14 text-text-500">{item.type}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
