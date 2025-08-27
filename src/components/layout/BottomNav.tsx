import { NavLink } from 'react-router-dom';

import home from '@_icons/icon-home.svg';
import homeHover from '@_icons/icon-homeHover.svg';
import writeHistory from '@_icons/icon-history.svg';
import writeHistoryHover from '@_icons/icon-historyHover.svg';
import shop from '@_icons/icon-shop.svg';
import shopHover from '@_icons/icon-shopHover.svg';
import mypage from '@_icons/icon-mypage.svg';
import mypageHover from '@_icons/icon-mypageHover.svg';

type Item = {
  to: string;
  label: string;
  icon: string;
  iconHover: string;
};

const items: Item[] = [
  { to: '/home', label: '홈', icon: home, iconHover: homeHover },
  {
    to: '/',
    label: '글 기록',
    icon: writeHistory,
    iconHover: writeHistoryHover,
  },
  { to: '/shop', label: '상점', icon: shop, iconHover: shopHover },
  { to: '/mypage', label: '마이', icon: mypage, iconHover: mypageHover },
];

export default function BottomNav() {
  return (
    <nav
      className={`
        fixed bottom-0 left-1/2 -translate-x-1/2 z-50
        h-[64px] w-[min(100vw,var(--mobile-w))]
        bg-white/90 backdrop-blur border-t border-border-25
        flex items-stretch justify-between px-1
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="하단 내비게이션"
    >
      {items.map(({ to, label, icon, iconHover }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'relative group flex-1 flex flex-col items-center justify-center gap-1 select-none',
              'text-[11px] leading-none transition-colors',
              isActive
                ? 'text-violet-500'
                : 'text-black-base hover:text-violet-500',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              {/* 기본 아이콘: hover시/활성시 숨김 */}
              <img
                src={icon}
                alt=""
                className={[
                  'w-6 h-6',
                  isActive ? 'hidden' : 'block group-hover:hidden',
                ].join(' ')}
                draggable={false}
              />

              {/* 호버/활성 아이콘: hover일 때 또는 활성일 때 표시 */}
              <img
                src={iconHover}
                alt=""
                className={[
                  'w-6 h-6',
                  isActive ? 'block' : 'hidden group-hover:block',
                ].join(' ')}
                draggable={false}
              />

              <span
                className={isActive ? 'typo-label4-m-12' : 'typo-label4-m-12'}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
