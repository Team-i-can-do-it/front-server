import right from '@_icons/common/icon-right.svg';
import { useNavigate } from 'react-router-dom';
import imagination from '@_icons/graphics/imagination.svg';

type TalkingCard = {
  id: string;
  title: string;
  date: string;
  to: string;
  image?: string;
};

export default function HomeCurrentSpeaking() {
  const BUTTONHOVER = [
    'transition-[transform,box-shadow,border-color,background-color] duration-400 cursor-pointer',
    'hover:-translate-y-0.2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-brand-violet-100',
    'active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet-200',
  ].join(' ');

  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/history');
  };

  const talkingCards: TalkingCard[] = [
    {
      id: '1',
      title: '만약 오늘 멸망한다면?',
      date: '2025년 8월 21일 17:20분',
      to: '',
      image: imagination,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-6 pt-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <p className="typo-h4-sb-16">현재 진행중인 말하기</p>
        <button
          onClick={handleViewAll}
          className="flex items-center typo-label2-r-14 text-gray-200 gap-1 cursor-pointer hover:underline"
          type="button"
        >
          전체보기
          <img
            src={right}
            alt="전체보기 오른쪽 아이콘"
            className="w-5 h-5 text-icon-500"
          />
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {talkingCards.map((talkingCard) => (
          <button
            key={talkingCard.id}
            className={`p-4 flex flex-row items-center w-full rounded-2xl border border-border-25 gap-3 bg-white
              ${BUTTONHOVER}`}
            onClick={() => navigate(talkingCard.to)}
          >
            {talkingCard.image ? (
              <img
                src={talkingCard.image}
                alt={`${talkingCard.title} 이미지`}
                className="w-12 h-12"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-brand-yellow-200" />
            )}

            <div className="flex flex-col text-start gap-1">
              <p className="typo-body2-r-16 ">{talkingCard.title}</p>
              <p className="typo-body3-r-14 text-gray-500">
                {talkingCard.date}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
