import MbtiCard from './summary/MbtiCard';
import ScoreCard from './summary/ScoreCard';
import { useMyResult } from '@_hooks/useResultSummary';
import dogLottie from '@_characters/dog.json';
import MbtiTagCard from './summary/MbtiTagCard';

export default function ResultSummary() {
  const { data, isLoading, error } = useMyResult();

  const mock = {
    name: '행님',
    score: 97,
    mbitName: '똑똑한 치와와',
    summary:
      '이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다. 이건 예시 텍스트입니다.',
    tags: ['# 감정형', '# 정보형', '# 차분형'],
    axes: [
      { left: '감정형', right: '논리형', value: 0.82 },
      { left: '스토리텔링형', right: '정보형', value: 0.3 },
      { left: '차분형', right: '활발형', value: 0.12 },
    ],
  };

  if (isLoading) return <ScoreCard isLoading />;
  if (error) return <div className="px-6 text-red-500">점수 불러오기 실패</div>;

  return (
    <section className="space-y-6">
      <ScoreCard score={data!.score} />
      <MbtiCard
        lottieData={dogLottie}
        mbitName={mock.mbitName}
        summary={mock.summary}
      />
      <MbtiTagCard tags={mock.tags} axes={mock.axes} />
    </section>
  );
}
