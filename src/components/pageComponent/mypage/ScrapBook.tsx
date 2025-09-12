export type ScrapItem = {
  id: string;
  title: string;
  subtitle: string;
  thumb?: string;
};

type ScrapBookProps = {
  items: ScrapItem[];
  className?: string;
  onClickItem?: (id: string) => void;
};

export default function ScrapBook({
  items,
  className = '',
  onClickItem,
}: ScrapBookProps) {
  return (
    <section className={['', className].join(' ')}>
      <h2 className="typo-h4-sb-16 text-text-700 mb-4">스크랩북</h2>

      <ul className="flex gap-3 overflow-x-auto no-scrollbar pr-2">
        {items.map((it) => (
          <li
            key={it.id}
            className="w-[140px] h-[178px] p-3 border border-[#f2f3f5] rounded-lg shrink-0
            active:scale-[0.995] transition-[transform,background-color] 
            duration-150 hover:bg-bg-10"
          >
            <button
              type="button"
              className="w-full h-full text-left cursor-pointer"
              onClick={() => onClickItem?.(it.id)}
            >
              {/* 썸네일(없으면 회색) */}
              {it.thumb ? (
                <img
                  src={it.thumb}
                  alt={it.title}
                  className="h-full w-full object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="h-24 rounded-lg bg-[#d1d1d1] mb-2" />
              )}

              <p className="typo-body2-r-16">{it.title}</p>
              <p className="typo-body3-r-14 text-gray-500 truncate">
                {it.subtitle}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
