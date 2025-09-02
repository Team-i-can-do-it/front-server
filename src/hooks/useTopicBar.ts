import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchOneTopicByCategory,
  fetchTopicCategory,
  type TopicCategory,
  type TopicItem,
} from '@_api/topics';

export function useTopicBar(categoryId: string) {
  // topic 한 건 가져오는 쿼리(상단 p 텍스트)
  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery<TopicCategory>({
    queryKey: ['topicCategory', categoryId],
    queryFn: () => fetchTopicCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // 해당 topic의 주제 랜덤 한 가지 가져오는 쿼리 (h3 텍스트)
  const {
    data: topic,
    isLoading: topicLoading,
    isFetching: topicFetching,
    isError: topicError,
    refetch: refetchTopic,
  } = useQuery<TopicItem>({
    queryKey: ['topicOne', categoryId],
    queryFn: () => fetchOneTopicByCategory(categoryId),
    enabled: !!categoryId,
    retry: 1,
  });

  // 밸런스게임에는 힌트 없음
  const canShowHint = useMemo(() => categoryId !== 'balance', [categoryId]);

  const changeTopic = async () => {
    await refetchTopic();
  };

  return {
    category,
    categoryLoading,
    categoryError,
    topic,
    topicLoading: topicLoading || topicFetching,
    topicError,
    canShowHint,
    changeTopic,
  };
}
