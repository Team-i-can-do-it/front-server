import ApiClient from './ApiClient';

export type WritingPayload = {
  topicId: number;
  content: string;
};

export type WritingResponse = {
  status: number;
  message: string;
  result: {
    id: number;
    content: string;
    topic: string;
    feedback: {
      mbtiScore: {
        expression_style: number;
        content_format: number;
        tone_of_voice: number;
      };
      evaluation: {
        substance: number;
        completeness: number;
        expressiveness: number;
        clarity: number;
        coherence: number;
      };
      evaluation_feedback: {
        substance_feedback?: string;
        completeness_feedback?: string;
        expressiveness_feedback?: string;
        clarity_feedback?: string;
        coherence_feedback?: string;
      };
      overall_score?: number;
      overall_feedback?: string;
    };
  };
};

export async function postWriting(payload: WritingPayload) {
  // 서버가 topicID(대문자 D)로 받으면 아래처럼 보냄:
  // const { topicId, ...rest } = payload;
  // const body = { topicID: topicId, ...rest };

  const { data } = await ApiClient.post<WritingResponse>('/writing', payload);
  return data;
}

// 상세 조회
export async function getWritingDetail(id: number) {
  const { data } = await ApiClient.get<WritingResponse>(`/writing/${id}`);
  return data;
}
