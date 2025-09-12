import ApiClient from '@_api/ApiClient';

// back 연결시 명칭 수정 필요해용
export type TopicCategory = {
  id: string;
  title: string;
  subtitle: string;
  iconKey: string;
  order: number;
  active: boolean;
};

// ----- 타입(백엔드 응답 스펙 반영) -----
type GetTopicRes = {
  status: number;
  message: string;
  result?: { topics?: string };
  topics?: string; // 혹시 top-level로 주는 경우 대비
};

export type TopicItem = {
  id: string;
  title: string;
};

export type TopicHint = {
  content: string;
};

// 기본 토픽(서버 실패시 폴백)
const DEFAULT_TOPICS: string[] = [
  '가장 좋아하는 영화나 드라마는 뭐예요? (인생 영화/드라마)',
  '요즘 가장 즐겨 듣는 노래가 있나요?',
  '좋아하는 음악 장르나 가수가 있다면?',
  '인생 책이나 웹툰을 꼽는다면?',
  '가장 좋아하는 음식과 싫어하는 음식은?',
  '민트초코 좋아하세요? (민초파 vs 반민초파)',
  '파인애플 피자에 대한 생각은? (하와이안 피자 호 vs 불호)',
  '가장 기억에 남는 여행지는 어디였나요?',
  '학창 시절 가장 재미있었던 추억은?',
  '어릴 적 꿈은 무엇이었나요?',
  '처음으로 아르바이트했던 경험 이야기',
  '최근에 새로 알게 된 놀라운 사실이 있다면?',
  '잊을 수 없는 선생님이나 멘토가 있나요?',
  '주말이나 쉬는 날에는 보통 무얼 하며 보내세요?',
  '요즘 새롭게 빠져있는 취미가 있나요?',
  '스트레스는 어떻게 푸는 편인가요?',
  '집순이/집돌이 vs 밖에서 활동하는 타입?',
  '즐겨 하는 운동이 있나요?',
  '산 vs 바다, 어디를 더 좋아하세요?',
  '무언가를 수집해 본 경험이 있나요?',
  '로또 1등에 당첨된다면 가장 먼저 하고 싶은 일은?',
  '무인도에 딱 3가지만 가져갈 수 있다면?',
  '꼭 한번 만나보고 싶은 역사 속 인물이나 유명인이 있나요?',
  '가방에 꼭 챙겨 다니는 필수템 3가지',
  '외계인이나 귀신의 존재를 믿으시나요?',
  '전화 통화 vs 문자 메시지, 어떤 걸 더 편하게 느끼나요?',
];
const makeId = (categoryId: string) => `${categoryId}-${Date.now()}`;

// 카테고리 목록 불러오는 api
export const fetchTopicCategories = async () => {
  const res = await ApiClient.get<TopicCategory[]>('/topic-categories');
  return res.data;
};

// 카테고리 주제 타이틀 불러오는 api
export const fetchTopicCategory = async (id: string) => {
  const res = await ApiClient.get<TopicCategory>(`/topic-categories/${id}`);
  return res.data;
};

// 카테고리의 주제중, 내용 하나 불러오는 api------------------------------
export const fetchOneTopicByCategory = async (
  categoryId: string,
): Promise<TopicItem> => {
  const path = '/topics'; // 백엔드 실제 엔드포인트
  const { data } = await ApiClient.get<GetTopicRes>(path, {
    params: { categoryId }, // 쿼리 파라미터 방식 가정
    headers: { Accept: 'application/json' },
  });

  const text = data?.result?.topics ?? data?.topics;
  if (typeof text === 'string' && text.trim()) {
    return { id: makeId(categoryId), title: text.trim() };
  }

  // 폴백(서버가 비었거나 에러): 기본 토픽에서 하나 선택
  const fallback =
    DEFAULT_TOPICS[Math.floor(Math.random() * DEFAULT_TOPICS.length)];
  return { id: makeId(categoryId), title: fallback };
};

// 카테고리 힌트 불러오기
export const fetchTopicHintByCategory = async (id: string) => {
  const res = await ApiClient.get<TopicHint>(`/topic-categories/${id}/hint`);
  return res.data;
};
