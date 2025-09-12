import VioletTag, { GrayTag } from '@_components/common/Tag';
import { useNavigate } from 'react-router-dom';
import topicExpression from '@_icons/graphics/topicExpression.svg';
import makingSentences from '@_icons/graphics/makingSentences.svg';

type TagType = 'violet' | 'gray';

type TopicOption = {
  title: string;
  subtitle: string;
  tags: { label: string; type: TagType }[];
  to: string;
  image?: string;
};

function TopicTag({ label, type }: { label: string; type: TagType }) {
  if (type === 'gray') return <GrayTag label={label} />;
  return <VioletTag label={label} />;
}

function TopicCard({ option }: { option: TopicOption }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(option.to)}
      className="flex flex-col items-center justify-center w-full gap-5 p-5 rounded-2xl bg-white cursor-pointer
      transition hover:shadow-lg hover:bg-gray-10 active:scale-[0.98]"
    >
      {/* 태그들 */}
      <div className="flex w-full gap-1">
        {option.tags.map((tagItem, tagIndex) => (
          <TopicTag
            key={`${tagItem.label}-${tagIndex}`}
            label={tagItem.label}
            type={tagItem.type}
          />
        ))}
      </div>

      {/* 이미지 자리 (임시는 노랑 상자) */}
      {option.image ? (
        <img
          src={option.image}
          alt={`${option.title} 이미지`}
          className="w-[52px] h-[52px]"
        />
      ) : (
        <div className="flex justify-center bg-yellow-200 w-[62px] h-[62px] rounded-xl" />
      )}

      {/* 타이틀/설명 */}
      <div className="flex flex-col gap-1 items-center">
        <div className="typo-h3-sb-18 mb-2">{option.title}</div>
        <div className="typo-label3-m-14 text-text-500 whitespace-nowrap">
          {option.subtitle}
        </div>
      </div>
    </button>
  );
}
export default function HomeTopicSelect() {
  const options: TopicOption[] = [
    {
      title: '주제로 표현하기',
      subtitle: '분야별 주제로 즉흥 말하기',
      tags: [
        { label: '순발력', type: 'violet' },
        { label: '5분', type: 'gray' },
      ],
      to: '/compose/topicSelect',
      image: topicExpression,
    },
    {
      title: '문장 만들기',
      subtitle: '단어 연결로 이야기 만들기',
      tags: [
        { label: '창의력', type: 'violet' },
        { label: '시간제한X', type: 'gray' },
      ],
      to: '/paragraph',
      image: makingSentences,
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {options.map((topicOption) => (
        <TopicCard key={topicOption.title} option={topicOption} />
      ))}
    </div>
  );
}
