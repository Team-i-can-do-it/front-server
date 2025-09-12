import RadarChart from './analysis/RadarChart';
import DetailCard from './analysis/DetailCard';
import RelatedTopic from './analysis/RelatedTopic';
import type { AnswerResult } from '@_api/ResultAPiClient';

type ResultAnalysisProps = { data: AnswerResult };

const clamp100 = (n: unknown) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
};

export default function ResultAnalysis({ data }: ResultAnalysisProps) {
  const name = '이음';
  const ev = data.feedback.evaluation;

  const labels = ['내용성', '완성도', '표현력', '명료성', '일관성'];
  const scores = [
    clamp100(ev.substance),
    clamp100(ev.completeness),
    clamp100(ev.expressiveness),
    clamp100(ev.clarity),
    clamp100(ev.coherence),
  ];

  const ef = data.feedback.evaluation_feedback ?? {};
  const details = [
    { title: '내용성', summary: ef.substance_feedback },
    { title: '완성도', summary: ef.completeness_feedback },
    { title: '표현력', summary: ef.expressiveness_feedback },
    { title: '명료성', summary: ef.clarity_feedback },
    { title: '일관성', summary: ef.coherence_feedback },
  ].filter((d) => !!d.summary) as { title: string; summary: string }[];

  const reads = [
    ef.substance_feedback && {
      id: `${data.id}-substance`,
      title: '내용성 향상 가이드',
      summary: ef.substance_feedback,
    },
    ef.completeness_feedback && {
      id: `${data.id}-completeness`,
      title: '완성도 향상 가이드',
      summary: ef.completeness_feedback,
    },
    ef.expressiveness_feedback && {
      id: `${data.id}-expressiveness`,
      title: '표현력 향상 가이드',
      summary: ef.expressiveness_feedback,
    },
    ef.clarity_feedback && {
      id: `${data.id}-clarity`,
      title: '명료성 향상 가이드',
      summary: ef.clarity_feedback,
    },
    ef.coherence_feedback && {
      id: `${data.id}-coherence`,
      title: '일관성 향상 가이드',
      summary: ef.coherence_feedback,
    },
  ].filter(Boolean) as { id: string; title: string; summary: string }[];

  return (
    <div className="pb-8">
      <RadarChart name={name} labels={labels} scores={scores} />

      <section className="mt-4">
        <ul>
          {details.map((d) => (
            <li key={d.title}>
              <DetailCard title={d.title} summary={d.summary} />
            </li>
          ))}
        </ul>
      </section>

      <RelatedTopic items={reads} />
    </div>
  );
}
