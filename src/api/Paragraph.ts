// 문단 완성(Paragraph Completion) API
// - 단어 조회: GET /paragraph-completion/words?count=3
// - 제출:     POST /paragraph-completion   { content }
// - 피드백:   POST /paragraph-completion/{id}/feedback { content }

import api from '@_api/ApiClient';
import {
  normalizeAnswerResult,
  type AnswerResult,
} from '@/api/ResultApiClient';

type WordsResponse<T> = {
  status: number;
  message: string;
  result: T;
};
export type SubmitPCRequest = {
  content: string;
  words: string[];
};

// 단어 조회
export async function fetchParagraphWords(count = 3) {
  const { data } = await api.get<WordsResponse<string[]>>(
    `/paragraph-completion/words`,
    {
      params: { count },
    },
  );
  return data.result ?? [];
}

// 제출
export async function submitParagraph(req: SubmitPCRequest) {
  const { data } = await api.post<WordsResponse<{ id: number }>>(
    '/paragraph-completion',
    req,
    {
      headers: { Accept: 'application/json' },
    },
  );
  return data.result.id;
}

// export async function requestParagraphFeedback(id: number, content: string) {
//   const { data } = await api.post<WordsResponse<{ id: number }>>(
//     `/paragraph-completion/${id}`,
//     { content },
//     { headers: { Accept: 'application/json' } },
//   );
//   return data.result.id;
// }

// export async function getParagraphDetail(id: number) {
//   const { data } = await api.get<{
//     status: number;
//     message: string;
//     result: {
//       id: number;
//       content: string;
//       topic: string;
//       feedback: any;
//       createdAt: string;
//     };
//   }>(`/paragraph-completion/${id}`);
//   return data;
// }

export async function getParagraphDetail(id: number): Promise<AnswerResult> {
  const { data } = await api.get(`/paragraph-completion/${id}`);
  return normalizeAnswerResult(data);
}
