import { useNavigate } from 'react-router-dom';
import balance from '@_icons/graphics/balance.svg';

type RecommendedCard = {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  image?: string;
};

export default function HomeRecommend() {
  const BUTTONHOVER = [
    'transition-[transform,box-shadow,border-color,background-color] duration-400',
    'hover:-translate-y-0.2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-brand-violet-100',
    'active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet-200',
  ].join(' ');

  const navigate = useNavigate();

  const recommendedCards: RecommendedCard[] = [
    {
      id: '1',
      title: '평생 치킨 금지 vs 평생 라면 금지?',
      subtitle: '밸런스 게임',
      to: '',
      image: balance,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-6 pt-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <p className="typo-h4-sb-16">이런 건 어때요?</p>
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {recommendedCards.map((recommendedCard) => (
          <button
            key={recommendedCard.id}
            className={`p-4 flex flex-row items-center w-full rounded-2xl border border-border-25 gap-3 bg-white
              ${BUTTONHOVER}`}
            onClick={() => navigate(recommendedCard.to)}
          >
            {recommendedCard.image ? (
              <img
                src={recommendedCard.image}
                alt={`${recommendedCard.title} 이미지`}
                className="w-12 h-12"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-brand-yellow-200" />
            )}

            <div className="flex flex-col text-start gap-1">
              <p className="typo-body2-r-16 ">{recommendedCard.title}</p>
              <p className="typo-body3-r-14 text-gray-500">
                {recommendedCard.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
