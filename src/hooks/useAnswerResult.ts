import { useQuery } from '@tanstack/react-query';
import { getAnswerResult, type AnswerResult } from '@_api/ResultAPiClient';

export function useAnswerResult(id: string) {
  return useQuery<AnswerResult>({
    queryKey: ['answer-result', id],
    queryFn: () => getAnswerResult(id), // GET /writing/{id}
    enabled: !!id, // id 없으면 네트워크 호출 X (하지만 훅은 항상 호출!)
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
