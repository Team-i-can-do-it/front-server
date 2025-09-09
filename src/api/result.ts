import ApiClient from './ApiClient';

/** 서버에서 내려주는 "결과 1건"의 원형 */
export type ServerResult = {
  id: string;
  topic: string; // 주제명
  text: string;
  createdAt: string; // ISO string
  result: {
    mbti: {
      expression_style: number; // -50 ~ +50
      content_format: number; // -50 ~ +50
      tone_of_voice: number; // -50 ~ +50
    };
    evaluation: {
      substance: number;
      completeness: number;
      expressiveness: number;
      clarity: number;
      coherence: number;
    };
    evaluation_feedback?: {
      substance_feedback?: string;
      completeness_feedback?: string;
      expressiveness_feedback?: string;
      clarity_feedback?: string;
      coherence_feedback?: string;
    };
    overall_feedback: string;
    overall_score: number; // 0~100
  };
};

/** 히스토리 응답 (커서 기반) */
export type HistoryListResponse = {
  items: ServerResult[];
  nextCursor?: string | null;
};

// 일별 평균 점수
export async function fetchDailyScores(params: {
  type: 'topic' | 'paragraph';
  year: number;
  month: number; // 1~12
}): Promise<number[]> {
  const { type, year, month } = params;
  // 백엔드 응답 예시: { items: [{ day: 1, avg: 42 }, ...] }
  const { data } = await ApiClient.get('/results/stat/daily', {
    params: { type, year, month },
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const out = Array<number>(daysInMonth).fill(0);

  const items = data?.items ?? data?.result?.items ?? data?.data?.items ?? [];

  for (const it of items) {
    const d = Number(it?.day);
    const v = Number(it?.avg);
    if (
      Number.isFinite(d) &&
      Number.isFinite(v) &&
      d >= 1 &&
      d <= daysInMonth
    ) {
      out[d - 1] = Math.max(0, Math.min(100, v));
    }
  }
  return out;
}
// 월별 평균 점수 응답
export type MonthlyAvgResponse = {
  year: number;
  /** 1~12월 12개(없으면 0), UI에서 0은 빈막대 처리 */
  monthlyAverages: number[];
};

/** 히스토리 목록 조회
 * @param type 'topic' | 'paragraph' (탭 필터)
 * @param cursor 다음 페이지 커서(null이면 첫 페이지)
 * @param limit 페이지 크기(기본 10)
 */
export async function fetchHistoryList({
  type,
  cursor,
  limit = 10,
}: {
  type: 'topic' | 'paragraph';
  cursor?: string | null;
  limit?: number;
}): Promise<HistoryListResponse> {
  // 엔드포인트만 백에 맞추기
  // ex) /results/history?type=topic&cursor=xxx&limit=10
  const { data } = await ApiClient.get('/results/history', {
    params: { type, cursor, limit },
  });
  return data;
}

// 월별 평균 점수
export async function fetchMonthlyAvg({
  type,
  year,
}: {
  type: 'topic' | 'paragraph';
  year: number;
}): Promise<MonthlyAvgResponse> {
  // 엔드포인트만 백에 맞추기
  // ex) /results/stat/monthly?type=topic&year=2025
  const { data } = await ApiClient.get('/results/stat/monthly', {
    params: { type, year },
  });
  return data;
}
