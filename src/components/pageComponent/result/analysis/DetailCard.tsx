type DetailCardProps = {
  // 항목명 (주제 명료성)
  title: string;
  // 요약 코멘트
  summary: string;
  className?: string;
};

export default function DetailCard({
  title,
  summary,
  className,
}: DetailCardProps) {
  return (
    <article
      className={['mb-3 border-b border-border-25', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 항목 제목 */}
      <h3 className="typo-h4-sb-16 mb-3">{title}</h3>

      {/* 항목 요약 */}
      <p className="typo-body2-r-16 text-text-500 leading-5 whitespace-pre-line mb-5">
        {summary}
      </p>
    </article>
  );
}
