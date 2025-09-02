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
        'w-[390px] pr-4 pl-2 fixed bottom-0 flex items-center gap-3 h-16 bg-brand-violet-50',
        disabledStyle,
      ].join(' ')}
    >
      <div>
        <div className="absolute bottom-full left-0 w-full px-6 mb-2 pointer-events-none">
          <p className="typo-label2-r-14 text-gray-500">
            현재 글자수 {textCount}자
          </p>
        </div>
        {/* 마이크 버튼 */}
        <button
          type="button"
          onClick={onRecordClick}
          aria-label="음성 녹음"
          className={[
            'w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer',
            PUPBLIC_STYLE,
            // hover + 모바일 active 모두 커버
            'hover:bg-brand-violet-200 active:bg-brand-violet-200',
            'hover:shadow-[0_4px_12px_rgba(125,51,254,0.18)]',
          ].join(' ')}
        >
          <img
            className="cursor-pointer w-6 h-6"
            src={iconRecord}
            alt="마이크 아이콘"
          />
        </button>
      </div>
      {/* 입력창 */}
      <div className="relative flex items-center w-[326px] min-h-16">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="입력해주세요"
          className="peer w-full self-center placeholder-transparent
          resize-none focus:outline-none 
          typo-body2-r-16 placeholder:text-brand-violet-200"
        ></textarea>
      </div>
      {/* 제출 버튼 */}
      <div>
        <div
          className="w-10 h-10 shrink-0 rounded-full bg-brand-violet-500
                 flex items-center justify-center cursor-pointer"
        >
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitDisabled}
            title="submit"
            className={[
              'w-10 h-10 shrink-0 rounded-full flex items-center justify-center cursor-pointer',
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
      </div>
    </fieldset>
  );
}
