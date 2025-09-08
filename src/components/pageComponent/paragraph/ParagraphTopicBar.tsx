import VioletTag from '@_components/common/Tag';
import { useParagraphWords } from '@_hooks/useParagraph';
import { useToast } from '@_hooks/useToast';
import IconRetry from '@_icons/common/icon-retry.svg?react';
import { useEffect, useRef, useState } from 'react';

type ParagraphTopicBarProps = {
  count?: number;
  onChangeWords?: (words: string[]) => void;
};

const MOCK_WORDS = ['무지개', '병아리', '할머니']; // 임시 단어,,

export default function SentenceTopicBar({
  count = 3,
  onChangeWords,
}: ParagraphTopicBarProps) {
  const [seed] = useState(0); // 강제 refetch 트리거
  const {
    data: words = [],
    isFetching,
    refetch,
  } = useParagraphWords(count + seed * 0); // key는 count만, refetch로 갱신

  const toast = useToast();

  // 0 -> N 으로 전이되면 "도착" 토스트
  const prevLenRef = useRef(0);
  useEffect(() => {
    if (isFetching) return;
    const prev = prevLenRef.current;
    const curr = words.length;

    if (prev === 0 && curr > 0) {
      toast('새 단어가 도착했어요!', 'success');
    }
    if (prev > 0 && curr === 0) {
      // 서버가 갑자기 빈 배열을 보내는 케이스 방지 안내
      toast('단어 목록을 불러오지 못했어요. 임시 단어를 표시합니다.', 'info');
    }
    prevLenRef.current = curr;
  }, [isFetching, words, toast]);

  // 로딩 중이거나 빈 배열이면 목 단어를 즉시 노출
  const isMock = isFetching || words.length === 0;
  const displayedWords = isMock ? MOCK_WORDS : words;

  const refresh = async () => {
    // 1) 클릭 즉시 피드백
    toast('새 단어를 불러오는 중…', 'info');

    try {
      const r = await refetch();
      const nextWords = r.data ?? [];

      if (nextWords.length > 0) {
        onChangeWords?.(nextWords); // 화면 먼저 업데이트
        toast('새 단어로 바꿨어요!', 'success'); // 그리고 성공 토스트
      } else {
        onChangeWords?.(MOCK_WORDS);
        toast('단어가 없습니다.', 'info');
      }
    } catch {
      onChangeWords?.(MOCK_WORDS);
      toast('단어를 불러오지 못했어요. 임시 단어로 대체합니다.', 'error');
    }
  };

  return (
    <section className="flex flex-col justify-between px-6 py-3 gap-5 border-b border-b-border-25">
      <div className="flex flex-col gap-1">
        <p className="typo-label1-r-15 text-gray-500">문장 만들기</p>
        <h3 className="typo-h3-sb-18">
          단어를 이어서 나만의 이야기를 만들어보세요
        </h3>
      </div>

      {/* 태그 들어가는 곳 */}
      <div className="flex items-center gap-2 flex-wrap min-h-8">
        <div className="w-full flex gap-3">
          {displayedWords.map((word) => (
            <VioletTag
              key={word}
              label={word}
              className="cursor-default rounded-lg"
              size="lg"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={refresh}
          className="typo-body2-r-16 text-gray-500 flex items-center gap-1 cursor-pointer hover:font-semibold ml-auto"
          disabled={isFetching}
        >
          단어 바꾸기
          <IconRetry className="w-[18px] h-[18px]" />
        </button>
      </div>
    </section>
  );
}
