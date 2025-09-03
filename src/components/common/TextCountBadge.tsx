type CharCountBadgeProps = {
  count: number;
  alignXClass?: string;
  className?: string;
};

export default function TextCountBadge({
  count,
  alignXClass = 'px-6',
  className = '',
}: CharCountBadgeProps) {
  return (
    <div
      className={[
        'absolute bottom-full left-0 w-full py-2 pointer-events-none bg-white-base',
        alignXClass,
        className,
      ].join(' ')}
    >
      <p className="typo-label2-r-14 text-gray-500">현재 글자수 {count}자</p>
    </div>
  );
}
