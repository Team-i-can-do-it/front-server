import { useToast } from '@_hooks/useToast';
import { useEffect, useRef, useState } from 'react';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (phone: string) => void;
};

export default function BottomSheet({
  open,
  onClose,
  onConfirm,
}: BottomSheetProps) {
  const [closing, setClosing] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const toast = useToast();
  const lastToastTime = useRef(0); // 최근 토스트 호출 시각 저장

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const now = Date.now();

    // 숫자 아닌 거 체크
    if (/[^0-9]/.test(value.replace(/-/g, ''))) {
      if (now - lastToastTime.current > 2000) {
        toast('숫자만 입력할 수 있습니다.', 'info');
        lastToastTime.current = now;
      }
    }

    // 숫자만 남기기
    value = value.replace(/[^0-9]/g, '');

    // 하이픈 자동 추가 (010-1234-5678)
    if (value.length <= 3) {
      // 010
      value = value;
    } else if (value.length <= 7) {
      // 010-1234
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else {
      // 010-1234-5678
      value =
        value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }

    setPhone(value);
    if (error) setError(false);
  };

  const handleConfirm = () => {
    if (!phone.trim()) {
      setError(true);
      return;
    }
    onConfirm(phone);
    handleClose();
  };

  // 애니메이션 끝나면 onClose 실행
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (open) {
      setClosing(false);
      setPhone('');
      setError(false);
    }
  }, [open]);

  if (!open && !closing) return null;

  // 드래그 바 잡고 내리기
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;

    const onMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientY - startY;
      if (diff > 50) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        handleClose();
      }
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center ">
      {/* 바텀시트 영역 */}
      <div
        className={`w-full max-w-[390px] bg-white rounded-t-2xl px-5 pb-5 ${
          closing ? 'animate-slide-down' : 'animate-slide-up'
        }`}
        style={{
          boxShadow:
            '0 13px 36px 0 rgba(49, 60, 75, 0.12), 0 0 36px 2px rgba(49, 60, 75, 0.10)',
        }}
      >
        {/* 드래그바 */}
        <div
          onMouseDown={handleDrag}
          className="w-10 h-1 bg-icon-25 rounded-full mx-auto m-2 cursor-pointer"
        />

        <p
          className={`typo-label3-m-14 mb-2 my-5 ${
            error ? 'text-red-500 animate-shake' : ''
          }`}
        >
          전화번호를 입력해주세요
        </p>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="010-"
          value={phone}
          onChange={handleChange}
          className={`w-full border-b py-2 outline-none mb-2 transition-colors ${
            error
              ? 'border-status-danger text-status-danger animate-shake'
              : 'border-border-25'
          }`}
        />
        {/* 버튼 */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl typo-button-b-16
            bg-brand-violet-50 text-brand-violet-500"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl typo-button-b-16
            bg-brand-violet-500 text-white"
          >
            구매하기
          </button>
        </div>
      </div>

      {/* 애니메이션 스타일 */}
      <style>
        {`
          @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slide-down {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
          .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
          .animate-slide-down { animation: slide-down 0.3s ease-in forwards; }
          .animate-shake { animation: shake 0.3s ease-in-out; }
        `}
      </style>
    </div>
  );
}
