// title 그냥 넣어놓은것.

export type RelatedItem = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  href?: string;
};

type RelatedTopicProps = {
  items: RelatedItem[];
  className?: string;
};

export default function RelatedTopic({ items, className }: RelatedTopicProps) {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <section className={['mt-10', className].filter(Boolean).join(' ')}>
      <h3 className="typo-h4-sb-16 mb-3">주제 관련 정보 읽어보기</h3>

      {!hasItems && (
        <ul className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className="rounded-md bg-gray-25 h-[144px] animate-pulse"
            />
          ))}
        </ul>
      )}

      {hasItems && (
        <ul className="grid grid-cols-3 gap-3">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={it.href || '#'}
                target="_blank"
                rel="noreferrer"
                className="block"
                aria-label={it.title}
              >
                {/* 썸네일 */}
                <div className="w-full h-[144px]  rounded-md overflow-hidden bg-gray-25">
                  {it.thumbnailUrl ? (
                    <img
                      src={it.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // 썸네일 로드 실패 시 placeholder
                        (e.currentTarget as HTMLImageElement).style.visibility =
                          'hidden';
                        (
                          e.currentTarget.parentElement as HTMLElement
                        ).style.backgroundColor = 'rgba(0,0,0,0.06)';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50" />
                  )}
                </div>

                {/* 제목 */}
                <p className="typo-body3-r-14 line-clamp-2">{it.title}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
