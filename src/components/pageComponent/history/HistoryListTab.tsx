import { useEffect, useMemo, useRef } from 'react';
import HistoryCard, {
  type HistoryCardVM,
} from '@_components/pageComponent/history/HistoryCard';
import { useHistoryInfinite } from '@_hooks/useHistory';
import type { ServerResult, HistoryListResponse } from '@_api/result';
import { TOPIC_GRAPHIC_ICON_MAP } from '@_page/topic/iconMap';
import { useTopicCategories } from '@_hooks/useTopicCategories';
import makingSentences from '@_icons/graphics/makingSentences.svg';
import { useNavigate } from 'react-router-dom';

type HistoryListTabProps = { type: 'topic' | 'paragraph' };

const toCardVM = (it: ServerResult): HistoryCardVM => ({
  id: it.id,
  title: it.topic ?? '제목 없음',
  preview: it.result?.overall_feedback ?? it.text ?? '',
  createdAt: it.createdAt,
  score: it.result?.overall_score ?? 0,
  mbti: it.result?.mbti ?? {
    expression_style: 0,
    content_format: 0,
    tone_of_voice: 0,
  },
});
// 탭별 목데이터
const MOCK_BY_TYPE: Record<HistoryListTabProps['type'], HistoryCardVM[]> = {
  topic: [
    {
      id: 'mock-topic-1',
      title: '만약 오늘 멸망한다면?',
      preview:
        '논거는 아직 부족하지만 주제는 명확해요. 다음엔 사례 근거를 2개 이상 넣어보자!',
      createdAt: new Date().toISOString(),
      score: 78,
      mbti: { expression_style: -20, content_format: 10, tone_of_voice: -5 },
    },
    {
      id: 'mock-topic-2',
      title: '초등학생은 교복이 왜 없을까?',
      preview:
        '일상 경험 중심의 서술이 좋아요. 반론을 상정하고 답하는 문장을 추가하면 더 탄탄해져요.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      score: 84,
      mbti: { expression_style: 5, content_format: -15, tone_of_voice: -10 },
    },
    {
      id: 'mock-topic-3',
      title: '공부할 때 음악은 도움이 될까?',
      preview:
        '주장-근거-예시 흐름이 자연스러워요. 수치 자료를 인용하면 설득력이 더 올라갑니다.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      score: 91,
      mbti: { expression_style: -8, content_format: 12, tone_of_voice: 18 },
    },
  ],
  paragraph: [
    {
      id: 'mock-para-1',
      title: '무지개, 할머니, 병아리',
      preview:
        '본문에 대한 미리보기 입니다. 본문에 대한 미리보기 입니다.본문에 대한 미리보기...',
      createdAt: new Date().toISOString(),
      score: 73,
      mbti: { expression_style: -12, content_format: -6, tone_of_voice: -14 },
    },
    {
      id: 'mock-para-2',
      title: '감자, 여행, 전자레인지',
      preview:
        '짧은 문장 연결이 좋아요. 접속사를 다양하게 써서 문장 간 흐름을 더 부드럽게 만들어 보자.',
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      score: 80,
      mbti: { expression_style: 10, content_format: -18, tone_of_voice: -8 },
    },
    {
      id: 'mock-para-3',
      title: '비누, 고래, 우산',
      preview:
        '표현이 선명해요. 단어의 의미적 연관성을 한 문장에서 한 번 더 짚어주면 완성도가 올라가요.',
      createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
      score: 88,
      mbti: { expression_style: -5, content_format: 8, tone_of_voice: 15 },
    },
  ],
};
const extractItems = (page: any) => {
  const raw = page?.items ?? page?.result?.items ?? page?.data?.items ?? [];
  return Array.isArray(raw) ? raw : [];
};

export default function HistoryListTab({ type }: HistoryListTabProps) {
  const navigate = useNavigate();
  // 카테고리(iconKey)
  const { data: categories = [] } = useTopicCategories();

  // id -> iconKey 맵
  const iconKeyById = useMemo<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const c of categories) m[c.id] = c.iconKey; // e.g. 'balance' -> 'balance'
    return m;
  }, [categories]);

  // 목록 페이징
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useHistoryInfinite(type);
  // topic / paragraph 별 아이콘 키 해석
  const resolveIconKey = (it: any): string => {
    if (type === 'paragraph') return 'makingSentences@fixed';
    const candidates = [
      it.iconKey,
      it.topicIconKey,
      it.category?.iconKey,
      iconKeyById[it.topicId],
      iconKeyById[it.categoryId],
      iconKeyById[it.topic], // topic이 'daily' 같은 id로 올 수도
    ].filter(Boolean) as string[];
    const hit = candidates.find((k) => k in TOPIC_GRAPHIC_ICON_MAP);
    return hit ?? 'daily';
  };

  // 카드 VM + 아이콘 주입
  const items = useMemo<HistoryCardVM[]>(() => {
    const pages: HistoryListResponse[] = data?.pages ?? [];
    const list = pages.flatMap((p) => extractItems(p).map(toCardVM));
    const base = list.length ? list : MOCK_BY_TYPE[type];

    return base.map((it) => {
      const key = resolveIconKey(it);
      const iconSrc =
        key === 'makingSentences@fixed'
          ? makingSentences
          : TOPIC_GRAPHIC_ICON_MAP[key] ?? TOPIC_GRAPHIC_ICON_MAP.daily;
      return { ...it, iconSrc };
    });
  }, [data, type, iconKeyById]);

  //    백엔드연결시 코드
  //     const raw =
  //       (page as any)?.items ??
  //       (page as any)?.result?.items ??
  //       (page as any)?.data?.items ??
  //       [];

  //     if (!Array.isArray(raw)) {
  //       console.warn('[HistoryListTab] page has no items array', { idx, page });
  //       return [];
  //     }

  //     return raw.map(toCardVM);
  //   });
  // }, [data]);

  // 무한스크롤
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((e) => e.isIntersecting)) {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }
      },
      { rootMargin: '160px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4">
      {status === 'pending' && (
        <ul className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-28 bg-gray-25 rounded-2xl animate-pulse" />
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id}>
              <HistoryCard item={it} onClick={() => navigate('/')} />
            </li>
          ))}
        </ul>
      )}

      {status === 'success' && items.length === 0 && (
        <p className="py-10 text-center text-text-200">아직 기록이 없어요.</p>
      )}

      <div ref={bottomRef} />
      {isFetchingNextPage && (
        <p className="py-4 text-center text-text-200">불러오는 중…</p>
      )}
    </div>
  );
}
