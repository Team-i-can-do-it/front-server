// import { useQuery } from '@tanstack/react-query';
// import ApiClient from '@_api/ApiClient';

// // 서버에 저장된 평가 키들
// export type Evaluation = {
//   substance: number; // 내용 충실성
//   completeness: number; // 완성도
//   expressiveness: number; // 표현력
//   clarity: number; // 주제 명료성
//   coherence: number; // 논리성
// };

// // 백엔드 응답(예시, 실제 필드는 백과 맞춰 조정)
// type ResultWithEvaluation = {
//   name?: string;
//   evaluation: Evaluation; // 점수 묶음
//   feedback?: Partial<Record<keyof Evaluation, string>>; // 항목별 코멘트(있으면)
//   relatedReads?: Array<{
//     id: string;
//     title: string;
//     thumbnailUrl?: string;
//     href?: string;
//   }>;
// };

// // 라벨 매핑 (UI 노출명)
// const LABELS: Record<keyof Evaluation, string> = {
//   clarity: '주제 명료성',
//   coherence: '논리성',
//   expressiveness: '표현력',
//   completeness: '완성도',
//   substance: '내용 충실성',
// };

// // 레이더 표시 순서 (피그마 순서에 맞게 조정)
// const ORDER: (keyof Evaluation)[] = [
//   'clarity',
//   'expressiveness',
//   'completeness',
//   'substance',
//   'coherence',
// ];

// export function useResultAnalysis() {
//   // 여기서는 /results/me 에 evaluation이 같이 온다고 가정.
//   // 만약 분리돼 있다면 엔드포인트만 /results/me/analysis 로 바꿔주면 됨.
//   const q = useQuery<ResultWithEvaluation>({
//     queryKey: ['my-result-analysis'],
//     queryFn: async () => {
//       const { data } = await ApiClient.get('/results/me');
//       return data;
//     },
//     staleTime: 60_000,
//   });

//   const labels = ORDER.map((k) => LABELS[k]);
//   const scores = ORDER.map((k) => q.data?.evaluation?.[k] ?? 0);

//   const details = ORDER.map((k) => ({
//     key: k,
//     title: LABELS[k],
//     summary: q.data?.feedback?.[k] ?? '',
//   }));

//   const reads = q.data?.relatedReads ?? [];

//   return {
//     name: q.data?.name ?? (q as any)?.data?.nickname ?? '',
//     labels,
//     scores,
//     details,
//     reads,
//     isLoading: q.isLoading,
//     isError: q.isError,

// }
