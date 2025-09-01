import iconRecord from '@_icons/common/icon-record-violet.svg';
import iconSubmit from '@_icons/common/icon-submit.svg';
type SubmitBarProps = {
  submitDisabled?: boolean;
  onSubmit?: () => void;
  onRecordClick?: () => void;
  value: string;
  onChange: (v: string) => void;
};

export default function SubmitBar({
  submitDisabled,
  onSubmit,
  onRecordClick,
  value,
  onChange,
}: SubmitBarProps) {
  return (
    <div className="w-[390px] pr-4 fixed bottom-0 flex items-center gap-3 h-16 bg-brand-violet-50">
      <div>
        {/* 마이크 버튼 */}
        <button
          type="button"
          onClick={onRecordClick}
          aria-label="음성 녹음"
          className="w-16 h-16 flex items-center justify-center
        cursor-pointer hover:bg-brand-violet-200"
        >
          <img
            className="cursor-pointer w-[30px] h-[30px]"
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
            onClick={onSubmit}
            disabled={submitDisabled}
            className="cursor-pointer"
          >
            <img src={iconSubmit} alt="제출 아이콘" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
