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

const REASON_MAP: Record<string, string> = {
  TOPIC: '주제로 표현하기',
  WORD: '단어로 문장 만들기',
  PURCHASE: '상품 구매',
  BUY: '상품 구매',
  ORDER: '상품 구매',
  GACHA: '상품 구매',
  EXPIRE: '포인트 소멸',
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

function pickReason(
  rawType: string,
  textBag: string,
  type: '적립' | '사용' | '소멸',
) {
  // 1) 사전 매핑 우선
  if (REASON_MAP[rawType]) return REASON_MAP[rawType];
  // 2) 텍스트에 구매/사용 키워드가 있으면 ‘상품 구매’
  if (/(PURCHASE|BUY|ORDER|REDEEM|SHOP|GACHA|구매|사용|차감)/i.test(textBag))
    return '상품 구매';
  // 3) 소멸이면 소멸
  if (type === '소멸') return '포인트 소멸';
  // 4) 기본
  return '활동 적립';
}

export async function getMyPoint(): Promise<MyPointResult> {
  const res = await ApiClient.get<MyPointResponse>('/member/mypage/point');

  const result = res.data?.result;

  if (Array.isArray(result)) {
    const histories = result.map((h: any, idx: number): PointHistoryItem => {
      const rawType = String(
        h?.activityType ?? h?.type ?? h?.historyType ?? '',
      ).toUpperCase();

      // 텍스트 소스 전부 모아 키워드 탐지
      const textBag = [
        rawType,
        h?.reason,
        h?.description,
        h?.title,
        h?.category,
        h?.detailType,
      ]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();

      const rawPoint = Number(h?.points ?? h?.amount ?? h?.point ?? 0) || 0;

      const isExpire = /(EXPIRE|EXPIRATION|만료|소멸)/.test(textBag);
      const isUse =
        !isExpire &&
        /(USE|SPEND|SPENT|SPENDING|DEDUCT|DECREASE|WITHDRAW|PURCHASE|BUY|ORDER|REDEEM|SHOP|GACHA|구매|사용|차감)/.test(
          textBag,
        );

      let type: '적립' | '사용' | '소멸';
      let amount: number;

      if (isExpire) {
        type = '소멸';
        amount = -Math.abs(rawPoint);
      } else if (isUse) {
        type = '사용';
        amount = -Math.abs(rawPoint); // 서버가 +로 줘도 강제 -
      } else {
        type = '적립';
        amount = Math.abs(rawPoint);
      }

      const reason = pickReason(rawType, textBag, type);

      return {
        id: String(h?.id ?? idx),
        date: toMMDD(h?.createdAt ?? h?.date ?? ''),
        reason,
        amount,
        type,
      };
    });

    const point = histories.reduce((sum, it) => sum + it.amount, 0);
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
