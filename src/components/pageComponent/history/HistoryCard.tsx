import { memo, useEffect, useMemo, useState } from 'react';
import VioletTag from '@_components/common/Tag';

export type HistoryCardVM = {
  id: string;
  title: string;
  preview: string;
  createdAt: string; // ISO string
  score: number; // 0~100
  mbti: {
    expression_style: number;
    content_format: number;
    tone_of_voice: number;
  };
  iconSrc?: string;
};

type HistoryCardProps = {
  item: HistoryCardVM;
  onClick?: (item: HistoryCardVM) => void;
  className?: string;
};

const formatDatetime = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${pad(
    d.getDate(),
  )}일 ${pad(d.getHours())}:${pad(d.getMinutes())}분`;
};

// 네이밍 규칙: 음수면 왼쪽(감정/스토리/차분), 양수면 오른쪽(논리/정보/활발)
const mbtiToTags = (m: HistoryCardVM['mbti']) => {
  const tag1 = m.expression_style < 0 ? '감정형' : '논리형';
  const tag2 = m.content_format < 0 ? '스토리형' : '정보형';
  const tag3 = m.tone_of_voice < 0 ? '차분형' : '활발형';
  return [`# ${tag1}`, `# ${tag2}`, `# ${tag3}`];
};

export default memo(function HistoryCard({
  item,
  onClick,
  className,
}: HistoryCardProps) {
  const tags = useMemo(() => mbtiToTags(item.mbti), [item.mbti]);
  const isSmall = useMediaQuery('(max-width: 389px)');

  function useMediaQuery(q: string) {
    const [match, setMatch] = useState(
      () => typeof window !== 'undefined' && window.matchMedia(q).matches,
    );
    useEffect(() => {
      const m = window.matchMedia(q);
      const onChange = (e: MediaQueryListEvent) => setMatch(e.matches);
      m.addEventListener('change', onChange);
      return () => m.removeEventListener('change', onChange);
    }, [q]);
    return match;
  }

  const activate = () => onClick?.(item);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  };

  const BUTTONHOVER = [
    'transition-[transform,box-shadow,border-color,background-color] duration-400 cursor-pointer',
    'hover:-translate-y-0.2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-brand-violet-100',
    'active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet-200',
  ].join(' ');

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${item.title} 상세 보기` : undefined}
      onClick={onClick ? activate : undefined}
      onKeyDown={onClick ? onKey : undefined}
      className={[
        `w-full bg-white rounded-[20px] p-5 border border-border-25`,
        onClick ? `cursor-pointer select-none ${BUTTONHOVER}` : '',
        className ?? '',
      ].join(' ')}
    >
      <header className="flex items-center gap-3 mb-2">
        {item.iconSrc ? (
          <img
            src={item.iconSrc}
            alt=""
            className="w-12 h-12 rounded-xl object-contain bg-gray-10"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gray-10" />
        )}
        <div className="flex-1">
          <h3 className="typo-body2-r-16">{item.title}</h3>
          <p className="typo-label4-m-12 text-text-100">
            {formatDatetime(item.createdAt)}
          </p>
        </div>
      </header>

      <p className="typo-body3-r-14 text-gray-500 line-clamp-2 mb-2 pb-2 overflow-hidden text-ellipsis whitespace-nowrap">
        {item.preview}
      </p>

      <div className="flex items-center justify-between ">
        <p className="typo-h2-sb-20 leading-none text-brand-violet-500">
          {String(item.score).padStart(2, '0')}점
        </p>
        <div className="flex gap-2">
          {tags.map((t) => (
            <VioletTag key={t} label={t} size={isSmall ? 'sm' : 'md'} />
          ))}
        </div>
      </div>
    </article>
  );
});
