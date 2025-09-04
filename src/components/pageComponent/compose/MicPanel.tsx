import IconKeyboard from '@_icons/common/icon-keyboard.svg?react';
import IconNext from '@_icons/common/icon-next.svg?react';
import iconRecord from '@_icons/common/icon-record.svg';
import IconPause from '@_icons/common/icon-pauseHover.svg?react';
import { useEffect, useState, useRef } from 'react';
import TextCountBadge from '@_common/TextCountBadge';
import useModalStore from '@_store/dialogStore';
import MicVisualizer from './MicVisualizer';
import { useMicVisualizer } from '@_hooks/useMicVisualizer';
import RecordingTime from './RecordingTime';

type MicPanelProps = {
  onTextInput?: () => void; // 텍스트 입력 모드
  onSubmit?: () => void; // handleSubmit 요청 제출 composePage에서 post Api요청
  value: string; // 입력된 텍스트
  textCount?: number; // 글자수
  isRecording?: boolean; // 녹음중 여부
  onToggleRecording?: () => void; // 녹음 요청 STT
};

export default function MicPanel({
  onTextInput,
  onSubmit,
  value,
  textCount = value?.length ?? 0,
  isRecording = false,
  onToggleRecording,
}: MicPanelProps) {
  const [enter, setEnter] = useState(false); // 패널 등장 애니메이션
  const [leaving, setLeaving] = useState(false); // 패널 사라지는 애니메이션
  const DURATION = 200; // 애니메이션 시간
  const { confirm } = useModalStore(); // 모달

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { start: startViz, stop: stopViz } = useMicVisualizer(
    isRecording,
    canvasRef,
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // MicPanel이 보이는 동안 isRecording이 true면 파형 시작, 아니면 정지
  useEffect(() => {
    if (isRecording) startViz();
    else stopViz();
  }, [isRecording, startViz, stopViz]);

  const stopAllNow = () => {
    // 파형 먼저 즉시 종료
    stopViz();
    // STT도 즉시 종료(ComposePage에서 onToggleRecording이 abort() 사용하도록 바꿔둔 상태)
    if (isRecording) onToggleRecording?.();
  };

  const closeWithAnimation = (after?: () => void) => {
    setLeaving(true);
    setEnter(false);
    window.setTimeout(() => {
      after?.();
      onTextInput?.();
    }, DURATION);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopAllNow();
    } else {
      startViz();
      onToggleRecording?.(); // STT 시작
    }
  };

  // 텍스트 입력 눌르면 중단
  const handleTextInput = () => {
    stopAllNow();
    closeWithAnimation(() => onTextInput?.());
  };

  const handleSubmit = () => {
    stopAllNow();
    confirm({
      title: '정말 제출하시겠어요?',
      description: '제출된 원고는 수정이 불가능해요',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => {
        onSubmit?.();
      },
    });
  };
  const PUPBLIC_STYLE =
    'transition-[transform,box-shadow,background-color,color] duration-200 ease-out ' +
    'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet-200';

  return (
    <section className="w-full max-w-[390px] fixed bottom-0 px-6 p-[33px] pt-5 bg-white-base">
      {isRecording && (
        <div className="flex flex-col items-center justify-center z-10 mb-10">
          <RecordingTime isRecording={isRecording} />
          <MicVisualizer ref={canvasRef} />
          <p className="typo-body2-r-16 text-brand-violet-500">
            문장들을 쭉 이어서 녹음해보세요
          </p>
        </div>
      )}
      <TextCountBadge
        count={textCount}
        alignXClass="px-6 border-b border-border-25"
      />
      <div
        className={[
          'flex justify-between items-center',
          'will-change-transform transition-[transform,opacity] duration-200',
          'motion-reduce:transition-none',
          enter && !leaving
            ? 'translate-y-0 opacity-100'
            : 'translate-y-0 opacity-0',
        ].join(' ')}
      >
        {/* 텍스트 키보드 버튼 */}
        <button
          type="button"
          onClick={handleTextInput}
          className={[
            'group flex flex-col items-center justify-center',
            'w-28 h-[58px] rounded-xl bg-bg-10 text-icon-200 cursor-pointer',
            PUPBLIC_STYLE,
            'hover:bg-bg-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)]',
          ].join(' ')}
        >
          <IconKeyboard className="w-6 h-6 [&_*]:fill-current" />
          <p className="typo-button-r-14 text-gray-500">텍스트 입력</p>
        </button>

        {/* 녹음 버튼 */}
        <button
          type="button"
          onClick={handleToggleRecording}
          aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
          className={[
            'flex flex-col items-center justify-center',
            'w-[72px] h-[72px] rounded-full cursor-pointer',
            PUPBLIC_STYLE,
            isRecording
              ? 'bg-brand-violet-600 ring-4 ring-brand-violet-200 animate-pulse'
              : 'bg-brand-violet-500 hover:bg-brand-violet-400 hover:shadow-[0_6px_16px_rgba(125,51,254,0.35)]',
          ].join(' ')}
        >
          {isRecording ? (
            <IconPause className="w-10 h-10 text-bg-white [&_*]:fill-current" />
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
          className={[
            'group flex flex-col items-center justify-center',
            'w-28 h-[58px] rounded-xl bg-brand-violet-50 text-brand-violet-500 cursor-pointer',
            PUPBLIC_STYLE,
            'hover:bg-brand-violet-100 hover:shadow-[0_4px_12px_rgba(125,51,254,0.18)]',
          ].join(' ')}
        >
          <IconNext className="w-6 h-6 [&_*]:fill-current" />
          <p className="typo-button-r-14">제출 하기</p>
        </button>
      </div>
    </section>
  );
}
