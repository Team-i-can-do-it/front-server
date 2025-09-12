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
        'absolute bottom-full w-full py-4 left-0 pointer-events-none bg-white-base z-0',
        alignXClass,
        className,
      ].join(' ')}
    >
      <p className="typo-label2-r-14 text-gray-500">현재 글자수 {count}자</p>
    </div>
  );
}
