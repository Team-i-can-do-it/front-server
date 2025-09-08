type TagSize = 'sm' | 'md' | 'lg';

type TagProps = {
  label: string;
  className?: string;
  size?: TagSize;
};

const sizeStyle: Record<TagSize, string> = {
  sm: 'px-2 py-1 typo-label4-m-12',
  md: 'px-3 py-[6px] typo-label3-m-14',
  lg: 'px-4 py-2 typo-h4-sb-16',
};

export function VioletTag({ label, className = '', size = 'sm' }: TagProps) {
  const colorStyle = 'bg-brand-violet-50 text-brand-violet-500';

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeStyle[size]} ${colorStyle} ${className}`}
    >
      {label}
    </span>
  );
}
// shop 에서 추첨 완료에 쓰일 태그
export function WhiteTextTag({ label, className = '' }: TagProps) {
  const colorStyle = 'bg-brand-violet-200 text-white-base';
  const typo = 'typo-label4-m-12';
  return (
    <span
      className={`inline-flex items-center rounded-full typo-label2-r-14 px-2 py-1 ${typo} ${colorStyle} ${className}`}
    >
      {label}
    </span>
  );
}

export function GrayTag({ label, className = '' }: TagProps) {
  const colorStyle = 'bg-[#f0f0f0] text-[#8e8e8e]';
  const typo = 'typo-label4-m-12';

  return (
    <span
      className={`inline-flex items-center rounded-full typo-label2-r-14 px-2 py-1 ${typo} ${colorStyle} ${className}`}
    >
      {label}
    </span>
  );
}

export default VioletTag;
