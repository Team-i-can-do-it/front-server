import { useEffect, useMemo, useRef } from 'react';
import MbtiCard from './summary/MbtiCard';
import ScoreCard from './summary/ScoreCard';
import MbtiTagCard from './summary/MbtiTagCard';
import type { AnswerResult } from '@/api/ResultAPiClients';
import { pickPersona, chooseSide, type Traits } from '@_utils/mbti';
import { MBTI_LOTTIES } from '@_constants/mbti/lottieMap';

import { MBTI_IMAGES } from '@_constants/mbti/imageMap';

import { useUpsertMemberMbti } from '@_hooks/useUpsertMemberMbti';

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

  const payload = useMemo(
    () => ({
      name: persona.title, // 대표 MBTI 이름
      description: summary, // 분석 요약 그대로 전달 (원하면 커스텀 문구로 가공)
      imageUrl: MBTI_IMAGES[persona.code] ?? '', // 번들된 정적 이미지 URL 문자열
    }),
    [persona.title, persona.code, summary],
  );

  const sentKeyRef = useRef<string | null>(null);
  const upsert = useUpsertMemberMbti();

  useEffect(() => {
    const key = JSON.stringify(payload);
    if (sentKeyRef.current === key) return; // 같은 내용 재전송 방지

    // 자동 저장 트리거
    upsert.mutate(payload);
    sentKeyRef.current = key;

    if (import.meta.env.DEV) {
      console.groupCollapsed('[VIEW] ResultSummary → upsert /member/mbti');
      console.log('payload:', payload);
      console.log('status:', 'sent');
      console.groupEnd();
    }
  }, [payload, upsert]);

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
