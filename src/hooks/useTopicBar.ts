import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  GetTopicCategory,
  type CategoryType,
  type TopicPayload,
} from '@_api/TopicApiClient';

export function useTopicBar(categoryId: CategoryType) {
  const { data, isLoading, isError, isFetching, refetch } = useQuery<{
    status: number;
    message: string;
    result: TopicPayload;
  }>({
    queryKey: ['writing-topic', categoryId],
    queryFn: () => GetTopicCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const changeTopic = () => refetch();
  const canShowHint = useMemo(() => categoryId !== 'random', [categoryId]);

  return {
    topic: data?.result, // { topic, title, description }
    topicLoading: isLoading || isFetching,
    topicError: isError,
    canShowHint,
    changeTopic,
  };
}
