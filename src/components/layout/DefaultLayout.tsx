import React from 'react';
import { Outlet } from 'react-router-dom';

interface DefaultLayoutProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  bottomNav?: React.ReactNode;
  headerFixed?: boolean;
  navFixed?: boolean;
  hasBottomNav?: boolean;
  noPadding?: boolean;
  debugFrame?: boolean;
}

const MOBILE_BASE = {
  W: 390,
  H: 844,
  HEADER_H: 44,
  NAV_H: 64,
  SIDE: 24,
};

export default function DefaultLayout({
  children,
  header,
  bottomNav,
  headerFixed = true,
  navFixed = true,
  hasBottomNav = true,
  noPadding = false,
  debugFrame = false,
}: DefaultLayoutProps) {
  const style = {
    '--mobile-w': `${MOBILE_BASE.W}px`,
    '--mobile-h': `${MOBILE_BASE.H}px`,
    '--header-h': `${MOBILE_BASE.HEADER_H}px`,
    '--nav-h': `${MOBILE_BASE.NAV_H}px`,
    '--side': `${MOBILE_BASE.SIDE}px`,
  } as React.CSSProperties;

  const showHeader = !!header;
  const showBottomNav = hasBottomNav && !!bottomNav;

  return (
    <div className="w-full min-h-svh flex justify-center bg-gray-15">
      <div
        style={style}
        className={[
          `w-full max-w-[var(--mobile-w)] min-h-[var(--mobile-h)] bg-white flex flex-col`,
          debugFrame
            ? 'rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.06)]'
            : '',
          noPadding ? 'px-0' : `px-[var(--side)]`,
        ].join(' ')}
      >
        {/* Header */}
        {showHeader &&
          (headerFixed ? (
            <div
              className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[var(--mobile-w)] z-50"
              style={{
                height: 'var(--header-h)',
                paddingTop: 'env(safe-area-inset-top, 0px)',
              }}
            >
              {header}
            </div>
          ) : (
            <div
              className="w-full"
              style={{
                height: 'calc(var(--header-h) + env(safe-area-inset-top, 0px))',
              }}
            >
              {header}
            </div>
          ))}

        {/* Content 영역: Header + BottomNav 제외한 가용 높이 */}
        <main
          className={[
            'w-full flex-1 overflow-y-auto',
            showBottomNav && navFixed
              ? 'pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px))]'
              : '',
          ].join(' ')}
        >
          {children ?? <Outlet />}
        </main>

        {/* Bottom Nav + 노치별 패딩값 */}
        {showBottomNav &&
          (navFixed ? (
            // 네비가 fixed 구현이라면, 여기선 요소만 렌더(추가 높이 박스 X)
            <>{bottomNav}</>
          ) : (
            // fixed가 아니라면 레이아웃 하단에 높이 지정해 배치
            <div
              className="w-full h-[64px] border-t border-gray-200"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              {bottomNav}
            </div>
          ))}
      </div>
    </div>
  );
}
