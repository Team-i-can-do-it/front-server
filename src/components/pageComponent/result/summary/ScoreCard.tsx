type ScoreCardProps = {
  name?: string;
  score?: number | null;
  outOf?: number;
  isLoading?: boolean;
  className?: string;
};

export default function ScoreCard({
  name = '도넛',
  score,
  outOf = 100,
  isLoading = false,
  className = '',
}: ScoreCardProps) {
  const safeScore =
    typeof score === 'number'
      ? Math.max(0, Math.min(outOf, Math.round(score)))
      : null;

  return (
    <article
      className={[
        'w-full max-w-[390px] h-24 rounded-xl p-4 bg-brand-violet-25',
        'flex items-center justify-between',
        className,
      ].join(' ')}
    >
      <div className="flex flex-col gap-1">
        <p className="typo-h4-sb-16">내 말하기 실력, 얼마나 좋을까?</p>

        <p className="typo-label2-r-14 text-text-500 flex items-baseline">
          <span className="min-w-0 max-w-[200px] truncate text-brand-violet-500">
            {name}
          </span>
          <span className="shrink-0">님의 점수는</span>
        </p>
      </div>

      <div className="tabular-nums">
        {isLoading ? (
          <div className="w-24 h-6 rounded bg-brand-violet-100 animate-pulse" />
        ) : safeScore !== null ? (
          <>
            <span className="typo-h1-b-24 text-brand-violet-500">
              {safeScore}점
            </span>
            <span className="typo-h4-sb-16 text-brand-violet-300">
              /{outOf}점
            </span>
          </>
        ) : (
          <span className="typo-h4-sb-16 text-brand-violet-300">- 점</span>
        )}
      </div>
    </article>
  );
}
