import ApiClient from '@_api/ApiClient';

export type PointHistoryItem = {
  id: string;
  date: string; // 'YYYY-MM-DD' or 'MM-DD'
  reason: string; // 예: 출석 체크, 상품 구매
  amount: number; // 절대값 기준 권장
  type: '적립' | '사용' | '소멸';
};

export type MyPointResult = {
  point: number;
  histories: PointHistoryItem[];
};

export type MyPointResponse = {
  status: number;
  message: string;
  result: any;
};

const ACTIVITY_REASON: Record<string, string> = {
  TOPIC: '주제로 표현하기',
  WORD: '단어로 문장 만들기',
};

function toMMDD(input?: string) {
  if (!input) return '';
  if (/^\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}

export async function getMyPoint(): Promise<MyPointResult> {
  const res = await ApiClient.get<MyPointResponse>('/member/mypage/point');

  const result = res.data?.result;

  // 1) 서버가 "배열(활동 로그)"로 줄 때 (지금 케이스)
  if (Array.isArray(result)) {
    const histories = result.map((h: any, idx: number): PointHistoryItem => {
      const activity = String(h?.activityType ?? '').toUpperCase();
      const reason = ACTIVITY_REASON[activity] ?? (activity || '활동 적립');
      const amount = Math.abs(Number(h?.points ?? 0)); // 적립은 항상 +
      return {
        id: String(h?.id ?? idx),
        date: toMMDD(h?.createdAt ?? ''),
        reason,
        amount,
        type: '적립',
      };
    });

    // 합계는 화면에서 mpData.point를 우선 쓰므로 여기 값은 보조용
    const point = histories.reduce(
      (sum, it) => (it.type === '적립' ? sum + it.amount : sum),
      0,
    );

    return { point, histories };
  }

  // 2) 혹시 객체로 내려오는 다른 스키마도 방어
  const raw = result ?? {};
  const primary =
    raw.histories ??
    raw.historyList ??
    raw.pointHistoryList ??
    raw.pointLogs ??
    raw.logs ??
    [];
  const extra = [
    ...(Array.isArray(raw.savingList) ? raw.savingList : []),
    ...(Array.isArray(raw.spendingList) ? raw.spendingList : []),
    ...(Array.isArray(raw.expireList) ? raw.expireList : []),
  ];
  const list = (Array.isArray(primary) ? primary : []).concat(extra);

  const histories = list.map((h: any, i: number): PointHistoryItem => {
    const rawType = String(h?.type ?? h?.historyType ?? '적립').toUpperCase();
    const type =
      rawType === 'USE' ? '사용' : rawType === 'EXPIRE' ? '소멸' : '적립';
    const base = Number(h?.amount ?? h?.point ?? 0);
    const amount = type === '적립' ? Math.abs(base) : -Math.abs(base);

    return {
      id: String(h?.id ?? h?.historyId ?? i),
      date: toMMDD(h?.date ?? h?.createdAt ?? h?.useDate),
      reason: h?.reason ?? h?.description ?? '포인트 내역',
      amount,
      type,
    };
  });

  const point = typeof raw.point === 'number' ? raw.point : 0;
  return { point, histories };
}
