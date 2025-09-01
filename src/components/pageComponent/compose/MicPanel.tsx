import IconKeyboard from '@_icons/common/icon-keyboard.svg?react';
import IconNext from '@_icons/common/icon-next.svg?react';
import iconRecord from '@_icons/common/icon-record.svg';
import IconPause from '@_icons/common/icon-pauseHover.svg?react';
import { useState } from 'react';

type MicPanelProps = {
  onClose?: () => void;
  onSubmit?: () => void;
};

export default function MicPanel({ onClose, onSubmit }: MicPanelProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    setIsRecording((prev) => !prev);
    //STT 기능 연동 자리
  };
  const handleSubmit = () => {
    onSubmit?.();
  };

  return (
    <section className="fixed inset-x-0 bottom-0 z-50 px-6 py-[33px]">
      <div className="mx-auto w-[390px] px-6 py-[33px]">
        <div className="flex justify-between items-center">
          {/* 텍스트 키보드 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="flex flex-col items-center justify-center
          w-28 h-[58px] rounded-xl bg-bg-10 text-icon-200
          cursor-pointer"
          >
            <IconKeyboard className="w-6 h-6 [&_*]:fill-current" />
            <p className="typo-button-r-14 text-gray-500">텍스트 입력</p>
          </button>

          {/* 녹음 버튼 */}
          <button
            type="button"
            onClick={handleToggleRecording}
            aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
            className="flex flex-col items-center justify-center
          w-[72px] h-[72px] bg-brand-violet-500 rounded-full
          cursor-pointer"
          >
            {isRecording ? (
              <IconPause
                name="녹음 중지 아이콘"
                className="w-10 h-10 text-bg-white [&_*]:fill-current"
              />
            ) : (
              <img
                src={iconRecord}
                alt="녹음 버튼 아이콘"
                className="w-10 h-10"
              />
            )}
          </button>

          {/* 제출하기 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex flex-col items-center justify-center
          w-28 h-[58px] rounded-xl bg-brand-violet-50 text-brand-violet-500
          cursor-pointer"
          >
            <IconNext className="w-6 h-6 [&_*]:fill-current" />
            <p className="typo-button-r-14">제출 하기</p>
          </button>
        </div>
      </div>
    </section>
  );
}
