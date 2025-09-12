import ApiClient from './ApiClient';

export type CategoryType =
  | 'random'
  | 'daily-life'
  | 'economy-business'
  | 'social-politics'
  | 'tech-future'
  | 'culture-arts';

export type TopicPayload = {
  topic: number | string;
  title: string;
  description: string; // hint
};

export const GetTopicCategory = async (category: CategoryType) => {
  const { data } = await ApiClient.get<{
    status: number;
    message: string;
    result: TopicPayload;
  }>(`/writing/topics/${category}`);
  return data;
};
