import { useSuspenseQuery } from '@tanstack/react-query';
import { getAnswerResult, type AnswerResult } from '@_api/ResultAPiClient'; // ★ APi 오타 금지

export function useAnswerResult(id: string) {
  return useSuspenseQuery<AnswerResult>({
    queryKey: ['answer-result', id],
    queryFn: () => getAnswerResult(id),
  });
}
