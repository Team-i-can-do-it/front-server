import MbtiCard from './summary/MbtiCard';
import ScoreCard from './summary/ScoreCard';
import MbtiTagCard from './summary/MbtiTagCard';
import type { AnswerResult } from '@_api/ResultAPiClient';
import { pickPersona, chooseSide, type Traits } from '@_utils/mbti';
import { MBTI_LOTTIES } from '@_constants/mbti/lottieMap';

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

  const traits: Traits = {
    expression: chooseSide(
      axes[0].value,
      axes[0].left,
      axes[0].right,
    ) as Traits['expression'],
    content: chooseSide(
      axes[1].value,
      axes[1].left,
      axes[1].right,
    ) as Traits['content'],
    tone: chooseSide(
      axes[2].value,
      axes[2].left,
      axes[2].right,
    ) as Traits['tone'],
  };
  const persona = pickPersona(traits);
  const lottieData = MBTI_LOTTIES[persona.code] ?? MBTI_LOTTIES.mbti1;

  const display = (t: string) => (t === '스토리텔링형' ? '스토리형' : t);
  const tags = [
    `# ${display(traits.expression)}`,
    `# ${display(traits.content)}`,
    `# ${display(traits.tone)}`,
  ];

  return (
    <section className="space-y-6">
      <ScoreCard score={score} />

      <MbtiCard
        lottieData={lottieData}
        mbitName={persona.title}
        summary={summary}
      />

      <MbtiTagCard tags={tags} axes={axes} />
    </section>
  );
}
