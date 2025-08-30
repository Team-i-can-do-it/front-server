import { useTopicBar } from '@_hooks/useTopicBar';
import iconRetry from '@_icons/common/icon-retry.svg';

import { useParams } from 'react-router-dom';

export default function TopicBar() {
  const { id: categoryIdParam } = useParams<{ id: string }>();
  const categoryId = categoryIdParam ?? '';
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

  const {
    category,
    categoryLoading,
    categoryError,
    topic,
    topicLoading,
    topicError,
    canShowHint,
    changeTopic,
  } = useTopicBar(categoryId);

  const categoryText = categoryLoading
    ? '로딩 중...'
    : categoryError
    ? '카테고리를 불러올 수 없습니다'
    : category?.title ?? '카테고리가 없습니다';

  const topicText = topicLoading
    ? '주제 불러오는 중...'
    : topicError
    ? '주제를 불러올 수 없습니다'
    : topic?.title ?? '주제가 없습니다';

  return (
    <section className="flex flex-col justify-between px-6 py-3 gap-12 border-b border-b-border-25">
      <div className="flex flex-col gap-1">
        <p className="typo-label1-r-15 text-gray-500">{categoryText}</p>
        <h3 className="typo-h3-sb-18">{topicText}</h3>
      </div>

      <div className="flex justify-between">
        {canShowHint && (
          <button
            type="button"
            className="typo-body2-r-16 text-brand-violet-400 cursor-pointer hover:font-semibold active:scale-95"
          >
            힌트보기
          </button>
        )}
        <div className="ml-auto" />

        <button
          type="button"
          onClick={changeTopic}
          className="typo-body2-r-16 text-gray-500 flex justify-center items-center gap-1
        cursor-pointer hover:font-semibold"
        >
          주제 바꾸기
          <img
            src={iconRetry}
            alt="주제 바꾸기 아이콘"
            className="w-[18px] h-[18px] text-icon-200"
          />
        </button>
      </div>
    </section>
  );
}
