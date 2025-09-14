// src/api/ResultApiClient.ts
import ApiClient from './ApiClient';

/* =========================
 *  타입
 * ========================= */
export type MbtiScore = {
  expression_style: number; // -50~+50
  content_format: number; // -50~+50
  tone_of_voice: number; // -50~+50
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
  createdAt?: string;
};

export type AnswerResult = {
  id: number | string;
  content: string;
  topic: string;
  feedback: Feedback;
  createdAt: string;
};

export type HistoryListPage = {
  items: AnswerResult[];
  page?: number;
  last?: boolean;
  nextCursor?: string | null;
};

export type MonthlyAvgResponse = {
  year: number;
  monthlyAverages: number[];
};

/* =========================
 *  유틸
 * ========================= */

const pickScore = (it: any) =>
  it?.score ?? it?.overallScore ?? it?.average ?? 0;

const pickCreatedAt = (it: any) =>
  it?.createdAt ?? it?.created_at ?? it?.createdDate ?? it?.date ?? null;

const clamp100 = (n: unknown) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
};
const toStr = (v: unknown) => (v == null ? '' : String(v));

/* =========================
 *  Normalizers
 * ========================= */
function normalizeMbtiScore(src: any): MbtiScore {
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
  const overall_score = clamp100(src?.overall_score ?? src?.overallScore);
  const createdAt = src?.createdAt ?? src?.created_at ?? undefined;
  return {
    mbtiScore: normalizeMbtiScore(src),
    evaluation: normalizeEvaluation(src?.evaluation),
    evaluation_feedback: normalizeEvaluationFeedback(src),
    overall_feedback: toStr(src?.overall_feedback ?? src?.overallFeedback),
    overall_score,
    createdAt: createdAt ? String(createdAt) : undefined,
  };
}

/** 서버 원본 1건 → AnswerResult */
export function normalizeAnswerResult(raw: any): AnswerResult {
  const src = raw?.result ?? raw;
  const id = src?.id ?? src?.answerId ?? '';
  const content = toStr(src?.content ?? src?.text);
  const topic = toStr(src?.topic ?? src?.title ?? '');
  const createdAt = toStr(src?.createdAt ?? src?.created_at ?? '');
  const feedbackSrc = src?.feedback ?? {
    mbtiScore: src?.result?.mbti,
    evaluation: src?.result?.evaluation,
    evaluation_feedback: src?.result?.evaluation_feedback,
    overall_feedback: src?.result?.overall_feedback,
    overall_score: src?.result?.overall_score,
    createdAt: src?.result?.createdAt,
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
 * 공용 페이지 페처 (파라미터 호환)
 * ========================= */
type Path = '/writing' | '/paragraph-completion';

async function getPageFlex(
  path: Path,
  page: number, // 0-based (프론트)
  pageSize = 10,
  sort?: string,
) {
  const tries = [
    { page: Math.max(1, page + 1), pageSize, sort }, // 1-based + pageSize
    { page, size: pageSize, sort }, // 0-based + size
    { page, size: pageSize }, // 0-based + size
    { page: Math.max(1, page + 1), size: pageSize }, // 1-based + size
  ] as const;

  let lastErr: unknown;
  for (const params of tries) {
    try {
      const { data } = await ApiClient.get(path, { params });
      const res = data?.result ?? data ?? {};
      const content = Array.isArray(res.content) ? res.content : [];
      const numberZero = Number(res.number ?? page);
      const totalPages = Number(res.totalPages ?? 0);
      const last = totalPages
        ? numberZero >= totalPages - 1
        : content.length === 0;
      return { content, numberZero, last };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/* =========================
 * 타입별 페이지 → HistoryListPage
 * ========================= */
export async function fetchWritingPage(
  page: number,
  pageSize = 10,
  sort = 'createdAt,DESC',
): Promise<HistoryListPage> {
  const { content, numberZero, last } = await getPageFlex(
    '/writing',
    page,
    pageSize,
    sort,
  );
  const items: AnswerResult[] = content.map((it: any) => {
    const created = pickCreatedAt(it);
    return {
      id: it.id,
      content: '',
      topic: String(it.topic ?? ''),
      createdAt: created ? String(created) : '',
      feedback: {
        mbtiScore: {
          expression_style: Number(it.expressionStyle ?? 0),
          content_format: Number(it.contentFormat ?? 0),
          tone_of_voice: Number(it.toneOfVoice ?? 0),
        },
        evaluation: {
          substance: 0,
          completeness: 0,
          expressiveness: 0,
          clarity: 0,
          coherence: 0,
        },
        evaluation_feedback: undefined,
        overall_feedback: String(it.summary ?? ''),
        overall_score: Number(pickScore(it)),
        createdAt: created ? String(created) : '',
      },
    };
  });
  return { items, page: numberZero, last, nextCursor: null };
}

export async function fetchParagraphPage(
  page: number,
  pageSize = 10,
  sort = 'createdAt,DESC',
): Promise<HistoryListPage> {
  const { content, numberZero, last } = await getPageFlex(
    '/paragraph-completion',
    page,
    pageSize,
    sort,
  );
  const items: AnswerResult[] = content.map((it: any) => {
    const created = pickCreatedAt(it);
    return {
      id: it.id,
      content: '',
      topic: Array.isArray(it.words) ? it.words.join(', ') : '',
      createdAt: created ? String(created) : '',
      feedback: {
        mbtiScore: {
          expression_style: Number(it.expressionStyle ?? 0),
          content_format: Number(it.contentFormat ?? 0),
          tone_of_voice: Number(it.toneOfVoice ?? 0),
        },
        evaluation: {
          substance: 0,
          completeness: 0,
          expressiveness: 0,
          clarity: 0,
          coherence: 0,
        },
        evaluation_feedback: undefined,
        overall_feedback: String(it.summary ?? ''),
        overall_score: Number(pickScore(it)),
        createdAt: created ? String(created) : '',
      },
    };
  });
  return { items, page: numberZero, last, nextCursor: null };
}

/* =========================
 * 통합 히스토리
 * ========================= */
export async function fetchHistory(
  type: 'topic' | 'paragraph',
  pageParam: number | string = 0,
  size = 10,
): Promise<HistoryListPage> {
  const page = typeof pageParam === 'number' ? pageParam : 0;
  return type === 'topic'
    ? fetchWritingPage(page, size)
    : fetchParagraphPage(page, size);
}

/* =========================
 * 일별 평균 (페이지에서 직접 계산)
 * ========================= */
export async function fetchDailyScores(params: {
  type: 'topic' | 'paragraph';
  year: number;
  month: number; // 1~12
}): Promise<number[]> {
  const { type, year, month } = params;

  // UTC 기준
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const sums = Array<number>(days).fill(0);
  const counts = Array<number>(days).fill(0);

  const monthStartUTC = Date.UTC(year, month - 1, 1, 0, 0, 0, 0);
  const monthEndUTC = Date.UTC(year, month, 0, 23, 59, 59, 999);

  let page = 0;
  const PAGE_SIZE = 50;
  const MAX_PAGES = 20;
  const SORT = 'createdAt,DESC';

  let addedAny = false; // 실제로 count를 1번이라도 늘렸는지

  while (page < MAX_PAGES) {
    const pageRes =
      type === 'topic'
        ? await fetchWritingPage(page, PAGE_SIZE, SORT)
        : await fetchParagraphPage(page, PAGE_SIZE, SORT);

    const items = pageRes.items;
    if (!items.length) break;

    let minTimeThisPage = Number.POSITIVE_INFINITY;

    for (const it of items) {
      const t = Date.parse(it.createdAt);
      if (!Number.isFinite(t)) continue;
      if (t < minTimeThisPage) minTimeThisPage = t;

      if (t >= monthStartUTC && t <= monthEndUTC) {
        const dUTC = new Date(t);
        const idx = dUTC.getUTCDate() - 1; // 0~days-1
        if (idx >= 0 && idx < days) {
          const raw = (it.feedback?.overall_score ??
            (it as any).score ??
            0) as number;
          const score = clamp100(raw);
          sums[idx] += score;
          counts[idx] += 1;
          addedAny = true;
        }
      }
    }

    if (pageRes.last) break;
    if (minTimeThisPage < monthStartUTC && addedAny) break; // 월 범위 끝
    page += 1;
  }

  // ✅ 전부 0이면 차트에서 목데이터 쓰도록 빈배열 반환
  if (!addedAny) return [];

  return sums.map((s, i) => (counts[i] ? Math.round(s / counts[i]) : 0));
}

/* =========================
 * 월별 평균 (서버 집계)
 * ========================= */
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
  const monthlyAverages = Array.from({ length: 12 }, (_, i) =>
    clamp100(arrRaw[i] ?? 0),
  );
  return { year: yearOut, monthlyAverages };
}

/* =========================
 * 결과 단건 조회
 * ========================= */
export async function getAnswerResult(
  id: string | number,
  type: 'topic' | 'paragraph' = 'topic',
) {
  if (type === 'topic') {
    const { data } = await ApiClient.get(`/writing/${id}`);
    return normalizeAnswerResult(data);
  } else {
    const { data } = await ApiClient.get(`/paragraph-completion/${id}`);
    return normalizeAnswerResult(data);
  }
}

/* =========================
 * (옵션) 커서 기반 API 호환
 * ========================= */
function normalizeListPage(raw: any): HistoryListPage {
  const data = raw?.result ?? raw?.data ?? raw;
  const itemsRaw =
    data?.items ?? raw?.items ?? raw?.content ?? raw?.results ?? [];
  const items: AnswerResult[] = (Array.isArray(itemsRaw) ? itemsRaw : []).map(
    (r: any) => normalizeAnswerResult(r),
  );
  const page = data?.page ?? raw?.page ?? data?.number ?? raw?.number;
  const totalPages =
    data?.totalPages ?? raw?.totalPages ?? data?.pageTotal ?? raw?.pageTotal;
  const lastExplicit =
    data?.last ??
    raw?.last ??
    (totalPages != null && page != null ? page >= totalPages - 1 : undefined);
  const nextCursor = data?.nextCursor ?? raw?.nextCursor ?? null;
  return {
    items,
    page: typeof page === 'number' ? page : undefined,
    last: typeof lastExplicit === 'boolean' ? lastExplicit : undefined,
    nextCursor,
  };
}

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
  const { data } = await ApiClient.get('/results/history', {
    params: { type, cursor, limit },
  });
  const page = normalizeListPage(data);
  return { items: page.items, nextCursor: page.nextCursor ?? null };
}
