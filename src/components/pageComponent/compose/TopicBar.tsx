import type { CategoryType } from '@_api/TopicApiClient';
import { useToast } from '@_hooks/useToast';
import { useTopicBar } from '@_hooks/useTopicBar';
import iconRetry from '@_icons/common/icon-retry.svg';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function TopicBar() {
  const toast = useToast();

  const { id: categoryIdParam } = useParams<{ id: CategoryType }>();
  const categoryId = categoryIdParam as CategoryType | undefined;

  if (!categoryId) {
    return (
      <section className="px-6 py-3 border-b border-b-border-25">
        <p className="typo-label1-r-15 text-gray-500">
          카테고리가 지정되지 않았어요
        </p>
        <h3 className="typo-h3-sb-18 text-gray-500">
          주제 선택 화면에서 선택해 주세요
        </h3>
      </section>
    );
  }

  const { topic, topicLoading, topicError, canShowHint, changeTopic } =
    useTopicBar(categoryId);

  const titleText = topicLoading
    ? '주제 불러오는 중...'
    : topicError
    ? '주제를 불러올 수 없습니다'
    : topic?.topic ?? '주제가 없습니다';

  const topicText = topicLoading
    ? '주제 불러오는 중...'
    : topicError
    ? '주제를 불러올 수 없습니다'
    : topic?.title ?? '주제가 없습니다';

  // 힌트 있는지 없는지, 확인
  const hintText = useMemo(
    () => (topic?.description ?? '').trim(),
    [topic?.description],
  );
  const hasHint = hintText.length > 0;

  // 힌트 토글 상태
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => {
    setHintOpen(false);
  }, [categoryId, topicText]);

  const onClickHint = () => {
    if (!canShowHint) return; // random 카테고리면 차단
    if (!hasHint) {
      toast('해당 주제의 힌트가 없어요.', 'info');
      return;
    }
    setHintOpen((v) => !v);
  };

  //말풍선 효과
  const DURATION = 100;
  const [hintMounted, setHintMounted] = useState(false);
  const [hintEnter, setHintEnter] = useState(false);

  useEffect(() => {
    if (hintOpen) {
      setHintMounted(true);
      const id = requestAnimationFrame(() => setHintEnter(true));
      return () => cancelAnimationFrame(id);
    } else {
      setHintEnter(false);
      const t = setTimeout(() => setHintMounted(false), DURATION);
      return () => clearTimeout(t);
    }
  }, [hintOpen]);

  return (
    <section className="flex flex-col justify-between px-6 py-3 gap-12 border-b border-b-border-25">
      <div className="flex flex-col gap-1">
        <p className="typo-label1-r-15 text-gray-500">{topicText}</p>
        <h3 className="typo-h3-sb-18">{titleText}</h3>
      </div>

      <div className="flex justify-between items-center">
        {canShowHint && (
          <div className="relative">
            <button
              type="button"
              onClick={onClickHint}
              aria-expanded={hintOpen}
              className={[
                'typo-body2-r-16 cursor-pointer active:scale-95',
                hintOpen
                  ? 'text-brand-violet-400'
                  : 'text-brand-violet-400 hover:font-semibold',
              ].join(' ')}
            >
              힌트 보기
            </button>

            {hintMounted && (
              <div
                className={[
                  'absolute left-0 top-[calc(100%+10px)] z-[60]',
                  'transition-opacity duration-150 ease-out',
                  hintEnter
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0  pointer-events-none',
                  'motion-reduce:transition-none',
                ].join(' ')}
                style={{ transitionDuration: `${DURATION}ms` }}
              >
                {/* 말풍선 */}
                <div
                  className="
                  relative w-3xs bg-white rounded-xl p-4
                  shadow-[0_13px_36px_0_rgba(49,60,75,0.12),_0_0_36px_2px_rgba(49,60,75,0.10)]
                  after:content-[''] after:absolute after:block after:w-0 after:h-0
                  after:border-solid after:border-t-0 after:border-r-[10px] after:border-b-[19px] after:border-l-[10px]
                  after:border-b-white after:border-x-transparent
                  after:top-[-13px] after:left-[10px]
                "
                >
                  <p className="typo-body3-r-14 text-gray-500 whitespace-pre-line">
                    {hintText}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ml-auto" />

        <button
          type="button"
          onClick={() => {
            setHintOpen(false);
            changeTopic();
          }}
          className="typo-body2-r-16 text-gray-500 flex items-center gap-1 cursor-pointer hover:font-semibold"
        >
          주제 바꾸기
          <img
            src={iconRetry}
            alt="주제 바꾸기 아이콘"
            className="w-[18px] h-[18px]"
          />
        </button>
      </div>
    </section>
  );
}
