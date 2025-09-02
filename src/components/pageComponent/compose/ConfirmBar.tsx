import TextCountBadge from '@_components/common/TextCountBadge';
import IconKeyboard from '@_icons/common/icon-keyboard.svg?react';
import { useState, useEffect } from 'react';
type ConfirmBarProps = {
  onSubmit?: () => void;
  onTextInput?: () => void;
  value: string;
  textCount?: number;
};

export default function ConfirmBar({
  onSubmit,
  onTextInput,
  value,
  textCount = value?.length ?? 0,
}: ConfirmBarProps) {
  const PUPBLIC_STYLE =
    'transition-[transform,box-shadow,background-color,color] duration-200 ease-out ' +
    'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet-200';

  const [enter, setEnter] = useState(false); // 등장 애니메이션
  const [leaving, setLeaving] = useState(false); // 퇴장 애니메이션
  const DURATION = 200;

  const closeWithAnimation = (after?: () => void) => {
    setLeaving(true);
    setEnter(false);
    window.setTimeout(() => {
      after?.();
      onTextInput?.();
    }, DURATION);
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  const handleTextInput = () => {
    closeWithAnimation(() => onTextInput?.());
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className="w-[390px] fixed bottom-0 left-1/2 -translate-x-1/2 px-6 py-[33px]
    border-t border-border-25"
    >
      <TextCountBadge count={textCount} alignXClass="px-6" />
      <div
        className={[
          'flex items-center',
          'gap-2',
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
            'shrink-0 basis-[112px] h-[60px] rounded-xl bg-bg-10 text-icon-200 cursor-pointer',
            PUPBLIC_STYLE,
            'hover:bg-bg-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)]',
          ].join(' ')}
        >
          <IconKeyboard className="w-6 h-6 [&_*]:fill-current" />
          <p className="typo-button-r-14 text-gray-500">텍스트 입력</p>
        </button>

        {/* 제출하기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          className={[
            'group flex flex-col items-center justify-center',
            'w-full h-[60px] rounded-xl bg-brand-violet-500 text-brand-violet-500 cursor-pointer',
            PUPBLIC_STYLE,
            'hover:bg-brand-violet-300 hover:shadow-[0_4px_12px_rgba(125,51,254,0.18)]',
          ].join(' ')}
        >
          <p className="typo-button-b-16 text-white-base">제출 하기</p>
        </button>
      </div>
    </section>
  );
}
