import { useQuery } from '@tanstack/react-query';
import {
  GetReferenceMaterialsByTopic,
  type ReferenceMaterialResponse,
} from '@_api/ReferenceMaterialApiClient';

export function useReferenceMaterials(topicId?: number) {
  return useQuery<ReferenceMaterialResponse>({
    queryKey: ['reference-material', topicId],
    queryFn: () => GetReferenceMaterialsByTopic(topicId as number),
    enabled: !!topicId, // topicId 없으면 호출 안 함
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
