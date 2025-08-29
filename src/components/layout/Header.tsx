import backIcon from '@_icons/common/icon-back.svg';
import closeIcon from '@_icons/common/icon-close.svg';
import { useNavigate, type To } from 'react-router-dom';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  backTo?: To;
  showClose?: boolean;
};

export default function Header({
  title,
  showBack = true,
  showClose = false,
  backTo = '/home',
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    const idx =
      (window.history.state && (window.history.state as any).idx) ?? 0;

    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(backTo, { replace: true });
    }
  };

  const handleClose = () => {
    navigate('/home', { replace: true });
  };

  return (
    <header
      className="h-[var(--header-h)] flex items-center justify-between px-6 py-[9px] bg-white"
      style={{}}
      aria-label="헤더"
    >
      {/* 왼쪽 */}

      <div className="w-10 h-10 -ml-1 flex items-center justify-center">
        {showBack ? (
          <button
            type="button"
            aria-label="뒤로가기 버튼"
            onClick={handleBack}
            className="hover:bg-gray-50 h-6 w-6 rounded-lg active:scale-95 transition 
            "
          >
            <img src={backIcon} alt="뒤로가기 버튼" className="h-6 w-6" />
          </button>
        ) : null}
      </div>
      {/* 가운데 */}
      <div className="flex-1 min-w-0 text-center">
        {title ? <h1 className="truncate typo-h4-sb-16">{title}</h1> : null}
      </div>

      {/* 오른쪽 */}
      <div className="w-10 h-10 -mr-1 flex items-center justify-center">
        {showClose ? (
          <button
            type="button"
            aria-label="닫기 버튼"
            onClick={handleClose}
            className="hover:bg-gray-50 h-6 w-6 rounded-lg active:scale-95 transition "
          >
            <img src={closeIcon} alt="닫기 버튼" className="h-6 w-6" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
