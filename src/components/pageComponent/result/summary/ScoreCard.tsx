import React from 'react';

/** 로딩/완료를 분기하는 안전한 타입 */
type LoadingProps = { isLoading: true; className?: string };
type LoadedProps = { isLoading?: false; score: number; className?: string };
type ScoreCardProps = LoadingProps | LoadedProps;

/** ScoreCard: 별점(0~5) + 'NN점' 텍스트 */
export default function ScoreCard(props: ScoreCardProps) {
  if (props.isLoading) {
    return (
      <section className={`pt-2 ${props.className ?? ''}`}>
        <div className="h-5 w-28 bg-gray-25 rounded animate-pulse mb-2" />
        <div className="h-8 w-24 bg-gray-25 rounded animate-pulse" />
      </section>
    );
  }

  const { score, className = '' } = props;
  const stars = clamp(score / 20, 0, 5); // 0~100 -> 0~5
  const display = Math.round(score);

  return (
    <section
      className={`flex flex-col justify-between items-center 
        pt-3 pb-2
        border-b-1 border-border-25
     ${className}`}
    >
      {/* 별 5개: 각 별은 회색(빈) + 노랑(채움, width%) 2레이어 */}
      <div className="flex items-center gap-1" aria-label={`별점 ${stars} / 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} fill={clamp(stars - i, 0, 1)} />
        ))}
      </div>

      {/* 점수 텍스트 */}
      <p className="p-4 typo-h0-b-32 text-text-900">
        {display}
        <span className="typo-h2-sb-20 text-text-900">점</span>
      </p>
    </section>
  );
}

/** 단일 별: fill 0~1 (0=빈, 1=가득, 0.5=반개) */
function Star({ fill }: { fill: number }) {
  const cutRight = (1 - fill) * 100;
  return (
    <span className="relative inline-block w-[22.42px] h-[22.42px]">
      {/* 빈 별(회색) */}
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full fill-current text-text-200"
        aria-hidden
      >
        <path d={STAR_PATH} />
      </svg>
      {/* 채운 별(노랑) - 가로 폭으로 잘라내 부분 채움 */}
      <span
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${cutRight}% 0 0)` }}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full fill-current text-brand-yellow-500"
        >
          <path d={STAR_PATH} />
        </svg>
      </span>
    </span>
  );
}

/** 공통 유틸/상수 */
const STAR_PATH =
  'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
