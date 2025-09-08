import RadarChart from './analysis/RadarChart';
import DetailCard from './analysis/DetailCard';
import RelatedTopic from './analysis/RelatedTopic';
import { useResultAnalysis } from '@_hooks/useResultAnalysis';

export default function ResultAnalysis() {
  const { name, labels, scores, details, reads, isLoading, isError } =
    useResultAnalysis();

  if (isLoading) {
    return (
      <section className="py-4">
        <div className="mb-3 h-[18px] w-[160px] bg-gray-25 animate-pulse rounded" />
        <div className="h-[220px] w-full bg-gray-25 animate-pulse rounded" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[62px] bg-gray-25 animate-pulse rounded"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-6">
        <p className="text-red-500 typo-label2-r-14">
          분석 데이터를 불러오지 못했어요.
        </p>
      </section>
    );
  }

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
