import ApiClient from './ApiClient';

export type CreateAnswerReq = {
  topicId: number; // INTEGER
  content: string; // STRING (100~600)
};

export type CreateAnswerRes = {
  status: number; // 201 기대
  message: string; // "글 저장 성공"
  result?: Record<string, unknown>;
  text?: string; // 유저가 쓴 글
};

export async function createAnswer(payload: CreateAnswerReq) {
  const { data } = await ApiClient.post<CreateAnswerRes>('/answers', payload, {
    headers: { Accept: 'application/json' },
  });
  return data;
}
