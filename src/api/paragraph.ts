// 문단 완성(Paragraph Completion) API
// - 단어 조회: GET /paragraph-completion/words?count=3
// - 제출:     POST /paragraph-completion   { content }
// - 피드백:   POST /paragraph-completion/{id}/feedback { content }

import api from '@_api/ApiClient';

export type WordsResponse = {
  status: number;
  message: string;
  data: { words: string[] };
};

export async function fetchParagraphWords(count = 3) {
  const { data } = await api.get<WordsResponse>(`/paragraph-completion/words`, {
    params: { count },
  });
  return data.data.words ?? [];
}

export type SubmitPCResponse = {
  status: number;
  message: string;
  data: { pc_id: number };
};

export async function submitParagraph(content: string) {
  const { data } = await api.post<SubmitPCResponse>(
    `/paragraph-completion`,
    { content },
    { headers: { Accept: 'application/json' } },
  );
  return data.data.pc_id;
}

export async function requestParagraphFeedback(pcId: number, content: string) {
  const { data } = await api.post<SubmitPCResponse>(
    `/paragraph-completion/${pcId}/feedback`,
    { content },
    { headers: { Accept: 'application/json' } },
  );
  return data.data.pc_id; // 서버 예시상 동일 형태 반환
}
