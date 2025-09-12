import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchParagraphWords,
  requestParagraphFeedback,
  submitParagraph,
} from '@_api/Paragraph';

export function useParagraphWords(count = 3) {
  return useQuery({
    queryKey: ['paragraph.words', count],
    queryFn: () => fetchParagraphWords(count),
    staleTime: 60 * 1000,
  });
}

export function useParagraphSubmit() {
  return useMutation({
    mutationFn: (content: string) => submitParagraph(content),
  });
}

export function useParagraphFeedback() {
  return useMutation({
    mutationFn: ({ pcId, content }: { pcId: number; content: string }) =>
      requestParagraphFeedback(pcId, content),
  });
}
