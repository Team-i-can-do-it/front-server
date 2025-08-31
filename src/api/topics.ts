import ApiClient from '@_api/ApiClient';

// back 연결시 수정
export type TopicCategory = {
  id: string;
  title: string;
  subtitle: string;
  iconKey: string;
  order: number;
  active: boolean;
};

export type TopicItem = {
  id: string;
  title: string;
};

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

// 카테고리의 주제중, 내용 하나 불러오는 api
export const fetchOneTopicByCategory = async (id: string) => {
  const res = await ApiClient.get<TopicItem>(
    `/topic-categories/${id}/topics:one`,
  );
  return res.data;
};
