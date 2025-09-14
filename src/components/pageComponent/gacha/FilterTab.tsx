import { useState } from 'react';
import IconBottom from '@_icons/common/icon-bottom.svg?react';

// 필터링 타입
type FilterTabProps = {
  filter?: 'high' | 'low';
  onChange: (f: 'high' | 'low') => void;
};

const OPTIONS = [
  { value: 'low', label: '가격 낮은순' },
  { value: 'high', label: '가격 높은순' },
] as const;

export default function FilterTab({
  filter = 'low',
  onChange,
}: FilterTabProps) {
  const [open, setOpen] = useState(false);

  const label = filter === 'low' ? '가격 낮은순' : '가격 높은순';

  return (
    <div className="relative inline-block">
      {/* 선택된 값 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-end
        text-gray-700 typo-label2-r-14
        w-40 py-2 cursor-pointer"
      >
        {label}
        <IconBottom
          className={`w-5 h-5 transition-transform ${
            open ? 'rotate-0' : 'rotate-180'
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <ul
          className="absolute right-0 z-10 min-w-[120px]
         bg-white border border-border-25 rounded-lg shadow-lg cursor-pointer"
        >
          {OPTIONS.map((opt, idx) => {
            // 위치 따라 rounded 설정 변경해서 ui 깨짐 해결
            const isFirst = idx === 0;
            const isLast = idx === OPTIONS.length - 1;
            return (
              <li key={opt.value}>
                <button
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    'w-full text-left px-3 py-2 typo-label2-r-14 transition-colors',
                    'text-gray-700 hover:bg-violet-50 hover:text-gray-900 cursor-pointer',
                    isFirst ? 'rounded-t-lg' : '',
                    isLast ? 'rounded-b-lg' : '',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
