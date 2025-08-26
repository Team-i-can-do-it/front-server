type TagProps = {
  label: string;
  color?: 'violet';
  className?: string;
};

export default function Tag({ label, color, className = '' }: TagProps) {
  const colorStyle =
    color === 'violet' ? 'bg-brand-violet-50 text-brand-violet-500' : '';

  return (
    <span
      className={`inline-flex items-center rounded-full typo-label2-r-14 px-2 py-1 ${colorStyle} ${className}`}
    >
      {label}
    </span>
  );
}
