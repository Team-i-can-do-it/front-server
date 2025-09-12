import MbtiCard from './summary/MbtiCard';
import ScoreCard from './summary/ScoreCard';
import dogLottie from '@_characters/dog.json';
import MbtiTagCard from './summary/MbtiTagCard';
import type { AnswerResult } from '@_api/ResultAPiClient';

type ResultSummaryProps = { data: AnswerResult };
const toAxis = (v: number) => (Number(v) + 50) / 100;

export default function ResultSummary({ data }: ResultSummaryProps) {
  const score = data.feedback.overall_score ?? 0;
  const summary = data.feedback.overall_feedback || '분석 요약이 없습니다.';
  const axes = [
    {
      left: '감정형',
      right: '논리형',
      value: toAxis(data.feedback.mbtiScore.expression_style ?? 0),
    },
    {
      left: '스토리텔링형',
      right: '정보형',
      value: toAxis(data.feedback.mbtiScore.content_format ?? 0),
    },
    {
      left: '차분형',
      right: '활발형',
      value: toAxis(data.feedback.mbtiScore.tone_of_voice ?? 0),
    },
  ];

  // const mock = {
  //   name: '행님',
  //   score: 97,
  //   mbitName: '똑똑한 치와와',
  //   summary:
  //     '이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다.',
  //   tags: ['# 감정형', '# 정보형', '# 차분형'],
  //   axes: [
  //     { left: '감정형', right: '논리형', value: 0.82 },
  //     { left: '스토리텔링형', right: '정보형', value: 0.3 },
  //     { left: '차분형', right: '활발형', value: 0.12 },
  //   ],
  // };
  const tags = axes.map((a) => `# ${a.value >= 0.5 ? a.right : a.left}`);
  const mbitName = '똑똑한 치와와'; // 필요 시 매핑 함수로 대체

  return (
    <section className="space-y-6">
      <ScoreCard score={score} />
      <MbtiCard lottieData={dogLottie} mbitName={mbitName} summary={summary} />
      <MbtiTagCard tags={tags} axes={axes} />
    </section>
  );
}
