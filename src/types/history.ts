export type HistoryTab = 'paragraph' | 'topic';

export type MbtiRaw = {
  expression_style: number; // -100 ~ 100 (예시)
  content_format: number;
  tone_of_voice: number;
};

export type EvaluationRaw = {
  substance: number; // 0~100
  completeness: number;
  expressiveness: number;
  clarity: number;
  coherence: number;
};

export type EvaluationFeedbackRaw = {
  substance_feedback: string;
  completeness_feedback: string;
  expressiveness_feedback: string;
  clarity_feedback: string;
  coherence_feedback: string;
};

export type FeedbackResultRaw = {
  mbti: MbtiRaw;
  evaluation: EvaluationRaw;
  evaluation_feedback: EvaluationFeedbackRaw;
  overall_feedback: string;
  overall_score: number; // 0~100
};

export type FeedbackApiResponse = {
  status: number; // 201 expected
  message: string; // "피드백 성공"
  result: FeedbackResultRaw;
};

export type HistoryItem = {
  id: string;
  tab: HistoryTab;
  title: string;
  preview: string;
  score: number; // overall_score (0~100)
  createdAt: string; // ISO
  tags: string[]; // ["감정형","정보형",...]
  icon?: 'flower' | 'chat' | 'note' | string;
};

export type HistoryListResp = {
  items: HistoryItem[];
  nextOffset?: number;
  total?: number;
};

export type MonthlyAvg = {
  month: number; // 1~12
  avg: number; // 0~100
};
