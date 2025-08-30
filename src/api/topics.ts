import ApiClient from '@_api/ApiClient';

export type TopicCategory = {
  id: string;
  title: string;
  subtitle: string;
  iconKey: string;
  order: number;
  active: boolean;
};

export const fetchTopicCategories = async () => {
  const res = await ApiClient.get<TopicCategory[]>('/topic-categories');
  return res.data;
};
