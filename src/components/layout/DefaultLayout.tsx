import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  bottomNav?: React.ReactNode;
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
  hasBottomNav = true,
  noPadding = false,
  debugFrame = false,
}: DefaultLayoutProps) {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-gray-15">
      <div
        className={[
          `w-full max-w-[${MOBILE_BASE.W}px] min-h-[${MOBILE_BASE.H}px] bg-white`,
          debugFrame
            ? 'rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.06)]'
            : '',
          noPadding ? 'px-0' : `px-[${MOBILE_BASE.SIDE}px]`,
        ].join(' ')}
      >
        {/* Header */}
        {header && (
          <div className="w-full h-[44px] flex items-center border-b border-gray-200">
            {header}
          </div>
        )}

        {/* Content 영역: Header + BottomNav 제외한 가용 높이 */}
        <main
          className={`w-full`}
          style={{
            minHeight: hasBottomNav
              ? `calc(${MOBILE_BASE.H}px - ${MOBILE_BASE.HEADER_H}px - ${MOBILE_BASE.NAV_H}px)`
              : `calc(${MOBILE_BASE.H}px - ${MOBILE_BASE.HEADER_H}px)`,
          }}
        >
          {children}
        </main>

        {/* Bottom Nav + 노치별 패딩값 */}
        {hasBottomNav && bottomNav && (
          <div
            className="w-full h-[64px] border-t border-gray-200"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {bottomNav}
          </div>
        )}
      </div>
    </div>
  );
}
