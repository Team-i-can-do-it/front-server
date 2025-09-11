import ApiClient from './ApiClient';

export type CategoryType =
  | 'random'
  | 'daily-life'
  | 'economy-business'
  | 'social-politics'
  | 'tech-future'
  | 'culture-arts';

// 랜덤 주제 조회
export const GetTopicCategory = async (
  category: CategoryType,
): Promise<{
  status: number;
  message: string;
  result: {
    topic: string;
    title: string;
    description: string;
  };
}> => {
  const response = await ApiClient.request({
    method: 'GET',
    url: `/writing/topics/${category}`,
  });

  return response.data;
};

//
