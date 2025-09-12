import IconPoint from '@_icons/common/icon-point.svg?react';

type PointHistory = {
  id: string;
  date: string; // '00.00'
  reason: string; // 출석 체크, 상품 구매
  amount: number; // 포인트
  type: '적립' | '사용' | '소멸'; // 적립, 사용, 소멸
};

export default function MyPoint() {
  // TODO: 실제 API 연동
  const myPoint = 700;
  const MOCK_POINT_HISTORY: PointHistory[] = [
    {
      id: '1',
      date: '09-11',
      reason: '출석 체크',
      amount: +1000,
      type: '적립',
    },
    {
      id: '2',
      date: '09-10',
      reason: 'CU 모바일 상품권 구매',
      amount: -3000,
      type: '사용',
    },
    {
      id: '3',
      date: '08-31',
      reason: '포인트 유효기간 만료',
      amount: -500,
      type: '소멸',
    },
  ];
  return (
    <main className="pt-[18px] pb-[92px] bg-white-base">
      {/* 포인트영역 */}
      <div
        className="flex flex-col items-start gap-[7px] 
      border-b border-border-25 py-3 mb-6 bg-white-base"
      >
        <p className="typo-label2-r-14 text-text-700">내 포인트</p>
        <div className="flex items-center justify-center">
          <IconPoint className="size-6" />
          <h1 className="typo-h0-b-32 text-brand-violet-500">
            {myPoint.toLocaleString()}{' '}
            <span className="typo-label2-r-14 text-text-700">point</span>
          </h1>
        </div>
      </div>

      {/* 포인트 내역 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="typo-h4-sb-16 text-text-700 mb-3">내 포인트 내역</h2>
        </div>
        <div>
          <ul className="space-y-10">
            {MOCK_POINT_HISTORY.map((data) => (
              <li
                key={data.id}
                className="flex items-center justify-between rounded-xl p-3"
              >
                <div className="flex gap-6">
                  <p className="typo-label4-r-12 text-text-200">{data.date}</p>
                  <p className="typo-h4-sb-16 text-text-700">{data.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-[10px]">
                  <p
                    className={`typo-label3-m-14 ${
                      data.amount > 0
                        ? 'text-brand-violet-500'
                        : 'text-text-700'
                    }`}
                  >
                    {data.amount > 0 ? '+' : ''}
                    {data.amount.toLocaleString()}
                  </p>
                  <p className="typo-label2-r-14 text-text-500">{data.type}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
