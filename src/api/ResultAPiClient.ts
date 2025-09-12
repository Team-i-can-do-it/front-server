// src/api/ResultApiClient.ts (혹은 형이 두신 경로에 맞게)
import ApiClient from './ApiClient';

/* =========================
 *  공통 타입 (정규화된 형태)
 * ========================= */
export type MbtiScore = {
  expression_style: number; // 보통 -50~+50 (서버 정책에 따름)
  content_format: number; // 보통 -50~+50
  tone_of_voice: number; // 보통 -50~+50
};

export type Evaluation = {
  substance: number; // 0~100
  completeness: number; // 0~100
  expressiveness: number; // 0~100
  clarity: number; // 0~100
  coherence: number; // 0~100
};

export type EvaluationFeedback = {
  substance_feedback?: string;
  completeness_feedback?: string;
  expressiveness_feedback?: string;
  clarity_feedback?: string;
  coherence_feedback?: string;
};

export type Feedback = {
  mbtiScore: MbtiScore;
  evaluation: Evaluation;
  evaluation_feedback?: EvaluationFeedback;
  overall_feedback: string;
  overall_score: number; // 0~100
  createdAt?: string; // ISO
};

export type AnswerResult = {
  id: number | string; // 64-bit 대비 string 가능
  content: string;
  topic: string;
  feedback: Feedback;
  createdAt: string; // ISO
};

export type AnswerResultResponse = {
  status: number;
  message: string;
  result: unknown; // 서버 원본은 유연하게 받고 아래 normalizer로 변환
};

/* =========================
 *  유틸
 * ========================= */
const clamp100 = (n: unknown) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
};

const toStr = (v: unknown) => (v == null ? '' : String(v));

/* =========================
 *   Normalizers (서버 원본 → 정규화 타입)
 * - 서버가 mbtiScore/mbti, evaluation_feedback/evaluationFeedback 등
 *   이름이 다를 때도 안전히 수용
 * ========================= */
function normalizeMbtiScore(src: any): MbtiScore {
  // 서버가 feedback.mbtiScore 또는 feedback.mbti 로 내려줄 수 있음
  const raw = src?.mbtiScore ?? src?.mbti ?? {};
  return {
    expression_style: Number(raw.expression_style ?? 0),
    content_format: Number(raw.content_format ?? 0),
    tone_of_voice: Number(raw.tone_of_voice ?? 0),
  };
}

function normalizeEvaluation(src: any): Evaluation {
  const ev = src?.evaluation ?? src ?? {};
  return {
    substance: clamp100(ev.substance),
    completeness: clamp100(ev.completeness),
    expressiveness: clamp100(ev.expressiveness),
    clarity: clamp100(ev.clarity),
    coherence: clamp100(ev.coherence),
  };
}

function normalizeEvaluationFeedback(src: any): EvaluationFeedback | undefined {
  const fb =
    src?.evaluation_feedback ?? src?.evaluationFeedback ?? src ?? undefined;

  if (!fb) return undefined;
  return {
    substance_feedback: toStr(fb.substance_feedback ?? fb.substanceFeedback),
    completeness_feedback: toStr(
      fb.completeness_feedback ?? fb.completenessFeedback,
    ),
    expressiveness_feedback: toStr(
      fb.expressiveness_feedback ?? fb.expressivenessFeedback,
    ),
    clarity_feedback: toStr(fb.clarity_feedback ?? fb.clarityFeedback),
    coherence_feedback: toStr(fb.coherence_feedback ?? fb.coherenceFeedback),
  };
}

function normalizeFeedback(src: any): Feedback {
  const createdAt = src?.createdAt ?? src?.created_at ?? undefined;

  const overall_score = clamp100(src?.overall_score ?? src?.overallScore);

  return {
    mbtiScore: normalizeMbtiScore(src),
    evaluation: normalizeEvaluation(src?.evaluation),
    evaluation_feedback: normalizeEvaluationFeedback(src),
    overall_feedback: toStr(src?.overall_feedback ?? src?.overallFeedback),
    overall_score,
    createdAt: createdAt ? String(createdAt) : undefined,
  };
}

/** 서버 원본 1건을 AnswerResult로 정규화 */
function normalizeAnswerResult(raw: any): AnswerResult {
  // 서버가 { result: {...} } 또는 곧장 {...}로 줄 수 있어 둘 다 수용
  const src = raw?.result ?? raw;

  const id = src?.id ?? src?.answerId ?? '';
  const content = toStr(src?.content ?? src?.text);
  const topic = toStr(src?.topic ?? src?.title ?? '');
  const createdAt = toStr(src?.createdAt ?? src?.created_at ?? '');

  // feedback 혹은 result.mbti/evaluation 등으로 오는 경우를 모두 수용
  const feedbackSrc = src?.feedback ?? {
    mbtiScore: src?.result?.mbti ?? undefined,
    evaluation: src?.result?.evaluation ?? undefined,
    evaluation_feedback: src?.result?.evaluation_feedback ?? undefined,
    overall_feedback: src?.result?.overall_feedback ?? undefined,
    overall_score: src?.result?.overall_score ?? undefined,
    createdAt: src?.result?.createdAt ?? undefined,
  };

  return {
    id: typeof id === 'number' ? id : String(id),
    content,
    topic,
    createdAt,
    feedback: normalizeFeedback(feedbackSrc),
  };
}

/* =========================
 * 통계 API
 * ========================= */

/** 일별 평균 점수 (length = 그 달의 일수, 빈 날은 0) */
export async function fetchDailyScores(params: {
  type: 'topic' | 'paragraph';
  year: number;
  month: number; // 1~12
}): Promise<number[]> {
  const { type, year, month } = params;
  const { data } = await ApiClient.get('/results/stat/daily', {
    params: { type, year, month },
  });

  const daysInMonth = new Date(year, month, 0).getDate(); // month가 1~12일 때 OK
  const out = Array<number>(daysInMonth).fill(0);

  const items = data?.items ?? data?.result?.items ?? data?.data?.items ?? [];

  for (const it of items) {
    const d = Number(it?.day);
    const v = clamp100(it?.avg);
    if (Number.isFinite(d) && d >= 1 && d <= daysInMonth) {
      out[d - 1] = v;
    }
  }
  return out;
}

/** 월별 평균 점수 응답 */
export type MonthlyAvgResponse = {
  year: number;
  /** 1~12월 12개(없으면 0) */
  monthlyAverages: number[];
};

/** 월별 평균 점수 (없거나 짧으면 12개로 보정) */
export async function fetchMonthlyAvg({
  type,
  year,
}: {
  type: 'topic' | 'paragraph';
  year: number;
}): Promise<MonthlyAvgResponse> {
  const { data } = await ApiClient.get('/results/stat/monthly', {
    params: { type, year },
  });

  const yearOut = Number(
    data?.year ?? data?.result?.year ?? data?.data?.year ?? year,
  );

  const arrRaw: unknown[] =
    data?.monthlyAverages ??
    data?.result?.monthlyAverages ??
    data?.data?.monthlyAverages ??
    data?.items ??
    [];

  // 12개로 맞추고 0~100 클램프
  const monthlyAverages = Array.from({ length: 12 }, (_, i) =>
    clamp100(arrRaw[i] ?? 0),
  );

  return { year: yearOut, monthlyAverages };
}

/* =========================
 * 히스토리 목록 (커서 기반)
 * ========================= */
export type HistoryListResponse = {
  items: AnswerResult[];
  nextCursor?: string | null;
};

export async function fetchHistoryList({
  type,
  cursor,
  limit = 10,
}: {
  type: 'topic' | 'paragraph';
  cursor?: string | null;
  limit?: number;
}): Promise<HistoryListResponse> {
  // TODO: 백엔드 실제 엔드포인트에 맞추세요.
  // 예: /results/history?type=topic&cursor=xxx&limit=10
  const { data } = await ApiClient.get('/results/history', {
    params: { type, cursor, limit },
  });

  const src = data?.result ?? data ?? {};

  const itemsRaw = src.items ?? data?.items ?? data?.data?.items ?? [];

  const items: AnswerResult[] = itemsRaw.map((r: any) =>
    normalizeAnswerResult(r),
  );

  const nextCursor =
    src.nextCursor ?? data?.nextCursor ?? data?.data?.nextCursor ?? null;

  return { items, nextCursor };
}

/* =========================
 * 결과 단건 조회
 * ========================= */
export async function getAnswerResult(id: string | number) {
  const { data } = await ApiClient.get(`/writing/${id}`);
  return normalizeAnswerResult(data);
}
