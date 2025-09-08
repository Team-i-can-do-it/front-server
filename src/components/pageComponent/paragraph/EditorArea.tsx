import { useMemo } from 'react';
import Spinner from './Spinner';

type EditorAreaProps = {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  highlight?: { lastSentence?: number; suffix?: string; regex?: RegExp };
  spinnerCount: number;
  setSpinnerCount: React.Dispatch<React.SetStateAction<number>>;
};

export default function EditorArea({
  value,
  onChange,
  placeholder = '답변을 작성하거나 음성으로 대답해주세요.',
  highlight,
  spinnerCount,
  setSpinnerCount,
}: EditorAreaProps) {
  // highlight 기능
  const { head, tail } = useMemo(() => {
    if (!value) return { head: '', tail: '' };

    // 마지막 글자
    if (highlight?.lastSentence && highlight.lastSentence > 0) {
      const cut = Math.max(0, value.length - highlight.lastSentence);
      return { head: value.slice(0, cut), tail: value.slice(cut) };
    }

    // suffix(문장 일부가 끝에 오는 경우)
    if (highlight?.suffix) {
      if (value.endsWith(highlight.suffix)) {
        const cut = value.length - highlight.suffix.length;
        return { head: value.slice(0, cut), tail: value.slice(cut) };
      }
      // 없으면 하이라이트 없이
      return { head: value, tail: '' };
    }

    // 정규식의 마지막 매치
    if (highlight?.regex) {
      const matches = Array.from(value.matchAll(highlight.regex));
      const last = matches.at(-1);
      if (last && last.index != null) {
        const start = last.index;
        const end = start + last[0].length;
        return {
          head: value.slice(0, start),
          tail: value.slice(start, end) + value.slice(end),
        };
      }
      return { head: value, tail: '' };
    }

    return { head: value, tail: '' };
  }, [value, highlight]);

  const isCounting = spinnerCount < 1;

  return (
    <div className="mt-13 px-6">
      {isCounting ? (
        <div className="relative w-full max-w-[325px] min-h-[200px]">
          <div
            className="absolute inset-0 whitespace-pre-wrap break-words typo-body1-m-20
                     text-gray-900 pointer-events-none select-none"
            aria-hidden="true"
          >
            {value ? (
              <>
                <span>{head}</span>
                {tail && <span className="text-brand-violet-500">{tail}</span>}
              </>
            ) : (
              <span className="text-gray-300">{placeholder}</span>
            )}
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly
            className="absolute inset-0 w-full h-full resize-none bg-transparent
                     text-transparent caret-black focus:outline-none
                     typo-body1-m-20"
          />
        </div>
      ) : (
        <div className="mt-20">
          <Spinner setCount={setSpinnerCount} count={spinnerCount} />
        </div>
      )}
    </div>
  );
}
