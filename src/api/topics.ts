import ApiClient from '@_api/ApiClient';

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

export const fetchTopicCategories = async () => {
  const res = await ApiClient.get<TopicCategory[]>('/topic-categories');
  return res.data;
};

export const fetchTopicCategory = async (id: string) => {
  const res = await ApiClient.get<TopicCategory>(`/topic-categories/${id}`);
  return res.data;
};

export const fetchOneTopicByCategory = async (id: string) => {
  const res = await ApiClient.get<TopicItem>(
    `/topic-categories/${id}/topics:one`,
  );
  return res.data;
};
