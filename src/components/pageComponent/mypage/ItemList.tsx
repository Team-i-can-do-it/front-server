import React from 'react';
import IconRight from '@_icons/common/icon-right.svg?react';

type ItemListProps = {
  className?: string;
  onClickPurchaseHistory?: () => void;
  onClickMbti?: () => void;
  onClickNotice?: () => void;
  onClickSupport?: () => void;
  onClickFeedback?: () => void;
};

/** 마이페이지 메뉴 리스트
 * - 구매 내역
 * - 내 mbti 컬렉션
 * - 공지사항
 * - 고객센터
 * - 피드백 보내기
 * - logout은 별도로 처리
 */
export default function ItemList({
  className = '',
  onClickPurchaseHistory,
  onClickMbti,
  onClickNotice,
  onClickSupport,
  onClickFeedback,
}: ItemListProps) {
  return (
    <nav className={className}>
      <MenuGroup>
        <Row label="구매 내역" onClick={onClickPurchaseHistory} />
        <Row label="내 mbti 컬렉션" onClick={onClickMbti} />
      </MenuGroup>

      <MenuGroup className="mt-4">
        <Row label="공지사항" onClick={onClickNotice} />
        <Row label="고객센터" onClick={onClickSupport} />
        <Row label="피드백 보내기" onClick={onClickFeedback} />
      </MenuGroup>
    </nav>
  );
}

/* ---------- presentational ---------- */
function MenuGroup({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        'rounded-lg border border-[#f2f3f5] overflow-hidden bg-white-base',
        className,
      ].join(' ')}
    >
      <ul>{children}</ul>
    </div>
  );
}

function Row({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={[
          'w-full h-[52px] px-4 flex items-center justify-between cursor-pointer',
          'active:scale-[0.995] transition-[transform,background-color] duration-150',
          'hover:bg-bg-10',
        ].join(' ')}
      >
        <span className="typo-h4-sb-16 text-text-500">{label}</span>
        <IconRight className="size-6 text-icon-100 [&_*]:fill-current" />
      </button>
      <div className="h-px bg-border-25" />
    </li>
  );
}
