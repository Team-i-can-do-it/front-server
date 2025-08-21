import React from 'react';
import backIcon from '../../assets/backIcon.svg';
import closeIcon from '../../assets/closeIcon.svg';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  title?: string;
  /** 기본: true. false면 왼쪽 영역을 비워두거나 직접 left 넣어 사용 */
  showBack?: boolean;
  /** 뒤로가기 실패 시 fallback 경로 */
  backTo?: string;
  /** 오른쪽 영역 커스텀 컨텐츠 */
  right?: React.ReactNode;
  /** sticky 여부 (기본 true) */
  sticky?: boolean;
  /** 반투명/블러 배경 (기본 true) */
  frosted?: boolean;
};

export default function Header({
  title,
  showBack = true,
  backTo,
  right,
  sticky = true,
  frosted = true,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    // React Router v6에서는 history.state.idx가 0보다 크면 "뒤로갈 대상"이 있음
    const idx =
      (window.history.state && (window.history.state as any).idx) ?? 0;

    if (idx > 0) {
      navigate(-1);
    } else {
      // 첫 진입이거나 스택이 없을 때 안전하게 fallback
      navigate(backTo || '/home', { replace: true });
    }
  };

  return (
    <div
      className={[
        sticky ? 'sticky top-0 z-20' : '',
        frosted ? 'bg-white/90 backdrop-blur' : 'bg-white',
      ].join(' ')}
      style={{
        // iOS notch 대응
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
      aria-label="페이지 헤더"
    >
      <div className=" flex items-center">
        <div className="w-10 h-10 -ml-1 flex items-center justify-center">
          {showBack ? (
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-50 active:scale-95 transition"
            >
              <img src={backIcon} alt="뒤로가기 버튼" className="h-6 w-6" />
            </button>
          ) : null}
        </div>

        {/* Center: Title */}
        <div className="flex-1 min-w-0 text-center">
          {title ? (
            <h1 className="truncate text-base font-semibold">{title}</h1>
          ) : null}
        </div>

        {/* Right: Slot */}
        <div className="w-10 h-10 -mr-1 flex items-center justify-center">
          {right ?? null}
        </div>
      </div>
    </div>
  );
}
