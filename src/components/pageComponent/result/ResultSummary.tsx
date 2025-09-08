import ScoreCard from './summary/ScoreCard';
import { useMyResult } from '@_hooks/useResultSummary';

export default function ResultSummary() {
  const { data, isLoading, error } = useMyResult();

  if (isLoading) return <ScoreCard isLoading />;
  if (error) return <div className="px-6 text-red-500">점수 불러오기 실패</div>;

  return (
    <section className="space-y-6">
      <ScoreCard name={data?.name} score={data?.score} />
    </section>
  );
}
