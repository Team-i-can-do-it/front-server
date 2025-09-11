import { useState } from 'react';
import mbti1 from '@_images/mbti1.png';

type Item = {
  id: string;
  name: string;
  img: string;
  locked?: boolean;
};

const items: Item[] = [
  { id: '1', name: '말썽쟁이 치와와', img: mbti1, locked: false }, // 최신(선택 가능)
  { id: '2', name: '수다쟁이 푸들', img: mbti1, locked: true },
  { id: '3', name: '똑똑한 치와와', img: mbti1, locked: true },
  { id: '4', name: '논리왕 푸들', img: mbti1, locked: true },
  { id: '5', name: '몽상하는 고양이', img: mbti1, locked: true },
  { id: '6', name: '사색하는 고양이', img: mbti1, locked: true },
  { id: '7', name: '도도한 고양이', img: mbti1, locked: true },
  { id: '8', name: '현명한 고양이', img: mbti1, locked: true },
];

export default function MyMBTI() {
  // "가장 최근 받은" = unlock된 것 중 첫 번째라고 가정
  const latestId = items.find((it) => !it.locked)?.id ?? undefined;

  // 대표 MBTI (초기값: 최신 항목)
  const [repId, _setRepId] = useState<string | undefined>(latestId);
  const rep = items.find((it) => it.id === repId)!;

  return (
    <div className="flex flex-col mt-9 mb-20">
      <TopSection rep={rep} latestId={latestId} />
      <BottomSection />
    </div>
  );
}

function TopSection({ rep, latestId }: { rep: Item; latestId?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 border-b border-border-25">
      <div className="typo-h4-sb-16 text-text-900">나의 대표 mbti</div>
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden">
        {latestId ? (
          <img
            src={rep.img}
            alt={rep.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <LockIcon className="w-9 h-9 text-gray-300" />
        )}
      </div>
      <div className="flex flex-col items-center gap-2 mb-9">
        <p className="typo-label3-m-16 text-brand-violet-500">
          {latestId ? rep.name : 'MBTI가 없습니다.'}
        </p>
        <p className="typo-label3-m-14 text-text-200">
          최근 받은 mbti만 대표 mbti로 설정할 수 있어요
        </p>
      </div>
    </div>
  );
}

function BottomSection() {
  // 첫 줄 2개만 추출
  const firstRow = items.slice(0, 2);
  // 나머지
  const rest = items.slice(2);

  return (
    <div className="flex flex-col items-center gap-8 mt-9 w-full">
      {/* 첫 줄: 2개만, 가운데 정렬 */}
      <ul className="flex justify-center gap-x-10 w-full max-w-[420px]">
        {firstRow.map((item) => (
          <MbtiCard key={item.id} item={item} />
        ))}
      </ul>

      {/* 나머지 줄: 3열 그리드 */}
      <ul className="grid grid-cols-3 gap-x-10 gap-y-12 w-full max-w-[420px]">
        {rest.map((item) => (
          <MbtiCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function MbtiCard({ item }: { item: Item }) {
  return (
    <li className="flex flex-col items-center">
      <div
        className={[
          'w-20 h-20 rounded-full flex items-center justify-center overflow-hidden',
          item.locked ? 'bg-icon-25' : 'bg-white',
        ].join(' ')}
      >
        {item.locked ? (
          <LockIcon className="w-9 h-9 text-gray-300" />
        ) : (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <span className="mt-3 text-center text-text-500 typo-label4-m-12">
        {item.name}
      </span>
    </li>
  );
}

// 심플 자물쇠 아이콘
function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-7-2a2 2 0 114 0v2h-4V6zm7 12H7v-8h10v8z" />
    </svg>
  );
}
