import TextCountBadge from '@_components/common/TextCountBadge';
import iconRecord from '@_icons/common/icon-record-violet.svg';
import iconConfirm from '@_icons/common/icon-submit.svg';

type SubmitBarProps = {
  submitDisabled?: boolean;
  submitUiDisabled: boolean;
  onConfirm?: () => void;
  onRecordClick?: () => void;
  value: string;
  onChange: (v: string) => void;
  textCount?: number;
};

export default function SubmitBar({
  submitDisabled,
  submitUiDisabled,
  onConfirm,
  onRecordClick,
  value,
  onChange,
  textCount = value?.length ?? 0,
}: SubmitBarProps) {
  //hover css
  const PUPBLIC_STYLE =
    'transition-[transform,box-shadow,background-color,color] duration-200 ease-out ' +
    'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet-200';

  const disabledStyle = submitUiDisabled
    ? 'opacity-50 grayscale pointer-events-none select-none'
    : '';
  return (
    <fieldset
      disabled={submitUiDisabled}
      aria-busy={submitUiDisabled}
      className={[
        'w-full max-w-[390px]',
        'fixed bottom-0',
        'border-0 m-0 p-0',
        disabledStyle,
      ].join(' ')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="relative flex items-center 
        h-16 px-4 gap-3 bg-brand-violet-50"
      >
        {/* 글자수 */}
        <TextCountBadge count={textCount} alignXClass="px-6" />

        {/* 마이크 버튼 */}
        <button
          type="button"
          onClick={onRecordClick}
          aria-label="음성 녹음"
          className={[
            'w-10 h-10 shrink-0 flex items-center justify-center rounded-xl cursor-pointer',
            PUPBLIC_STYLE,
            'hover:bg-brand-violet-200 active:bg-brand-violet-200',
            'hover:shadow-[0_4px_12px_rgba(125,51,254,0.18)]',
          ].join(' ')}
        >
          <img className="w-6 h-6" src={iconRecord} alt="마이크 아이콘" />
        </button>

        {/* 입력창: 유동폭 */}
        <div className="relative flex items-center w-0 flex-1 min-w-0">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="입력해주세요"
            className="peer w-full resize-none focus:outline-none
                   typo-body2-r-16 placeholder:text-brand-violet-200"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitDisabled}
          title="submit"
          className={[
            'w-10 h-10 shrink-0 rounded-full flex items-center justify-center',
            'bg-brand-violet-500 text-white',
            PUPBLIC_STYLE,
            submitDisabled
              ? 'opacity-50 cursor-not-allowed active:scale-100'
              : 'hover:bg-brand-violet-400 active:bg-brand-violet-400 hover:shadow-[0_6px_16px_rgba(125,51,254,0.35)]',
          ].join(' ')}
        >
          <img src={iconConfirm} alt="제출 아이콘" className="h-6 w-6" />
        </button>
      </div>
    </fieldset>
  );
}
