import RadarChart from './analysis/RadarChart';
import DetailCard from './analysis/DetailCard';
import RelatedTopic from './analysis/RelatedTopic';
import type { AnswerResult } from '@/api/ResultAPiClients';

import { useAuthStore } from '@/store/authStore';
import { useParams } from 'react-router-dom';
import { useReferenceMaterials } from '@/hooks/useReferenceMaterials';

type ResultAnalysisProps = { data: AnswerResult; topicId?: string };

const clamp100 = (n: unknown) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
};

export default function ResultAnalysis({ data, topicId }: ResultAnalysisProps) {
  const name = useAuthStore?.((s) => s.user?.name) ?? '이음';

  const params = useParams();
  const derivedTopicId =
    topicId || (params.id as string | undefined) || (data as any)?.topicId;

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
  // 참고 자료 api
  const { data: refData, isLoading } = useReferenceMaterials(derivedTopicId);

  const reads =
    refData?.result?.map((r, i) => ({
      id: `${derivedTopicId ?? 'topic'}-${i}`,
      title: r.title,
      thumbnailUrl: r.imageUrl,
      href: r.url,
    })) ?? [];

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

      <RelatedTopic items={isLoading ? [] : reads} />
    </div>
  );
}
