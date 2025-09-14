import { useSuspenseQuery } from '@tanstack/react-query';
import { getAnswerResult, type AnswerResult } from '@_api/ResultAPiClient'; // ★ APi 오타 금지
import { useQuery } from '@tanstack/react-query';
import { getParagraphDetail } from '@_api/Paragraph';

export function useAnswerResult(id: string) {
  return useSuspenseQuery<AnswerResult>({
    queryKey: ['answer-result', id],
    queryFn: () => getAnswerResult(id),
  });
}

export function useParagraphResult(id: string | number) {
  return useQuery({
    queryKey: ['paragraph.result', id],
    queryFn: () => getParagraphDetail(Number(id)),
    enabled: !!id,
  });
}
