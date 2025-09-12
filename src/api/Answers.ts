import ApiClient from './ApiClient';

export type CreateAnswerReq = {
  topicId: number; // INTEGER
  content: string; // STRING (100~600)
};

export type CreateAnswerRes = {
  status: number; // 201 기대
  message: string; // "글 저장 성공"
  result?: Record<string, unknown>;
};

export async function createAnswer(payload: CreateAnswerReq) {
  // 로그 찍기
  console.log('[createAnswer] 실제 payload', JSON.stringify(payload));
  console.log('[createAnswer] 요청 준비:', {
    url: '/writing',
    baseURL: ApiClient.defaults.baseURL,
    headers: ApiClient.defaults.headers,
    payload,
  });

  try {
    const { data } = await ApiClient.post<CreateAnswerRes>('/writing', payload);
    console.log('[createAnswer] 응답 수신:', data);
    return data;
  } catch (err: any) {
    console.error('[createAnswer] 요청 실패:', {
      status: err?.response?.status,
      data: err?.response?.data,
      headers: err?.response?.headers,
    });
    throw err;
  }
}
