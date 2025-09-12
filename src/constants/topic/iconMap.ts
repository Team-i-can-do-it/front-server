import balance from '@_icons/graphics/balance.svg';
import culture from '@_icons/graphics/culture.svg';
import daily from '@_icons/graphics/daily.svg';
import economy from '@_icons/graphics/economy.svg';
import imagination from '@_icons/graphics/imagination.svg';
import society from '@_icons/graphics/society.svg';
import tech from '@_icons/graphics/technology.svg';
import philosophy from '@_icons/graphics/philosophy.svg';
import type { TopicCategory } from '@_api/Topics';

export const TOPIC_GRAPHIC_ICON_MAP: Record<string, string> = {
  balance,
  culture,
  daily,
  economy,
  imagination,
  society,
  tech,
  philosophy,
};

export const MOCK_TOPICS: TopicCategory[] = [
  {
    id: 'random',
    title: '추천 밸런스 게임',
    subtitle: '자신의 생각을 표현해 보세요.',
    iconKey: 'balance',
    order: 1,
    active: true,
  },
  {
    id: 'daily-life',
    title: '일상·취미',
    subtitle: '가볍게 오늘 있었던 일이나 취미를 이야기해요.',
    iconKey: 'daily',
    order: 2,
    active: true,
  },
  // {
  //   id: 'imagination',
  //   title: '가상·상상력',
  //   subtitle: '상상 속 상황이나 가상의 세계를 표현해요.',
  //   iconKey: 'imagination',
  //   order: 3,
  //   active: true,
  // },
  {
    id: 'economy-business',
    title: '경제·비즈니스',
    subtitle: '돈, 투자, 회사 일에 대해 생각을 말해요.',
    iconKey: 'economy',
    order: 3,
    active: true,
  },
  {
    id: 'social-politics',
    title: '사회·정치',
    subtitle: '사회 이슈와 정치적 관점을 나눠 말해요.',
    iconKey: 'society',
    order: 4,
    active: true,
  },
  {
    id: 'tech-future',
    title: '기술·미래',
    subtitle: '최신 기술과 미래 변화에 대해 이야기해요.',
    iconKey: 'tech',
    order: 5,
    active: true,
  },
  {
    id: 'culture-arts',
    title: '문화·예술',
    subtitle: '영화, 음악, 전시 같은 문화 경험을 말해요.',
    iconKey: 'culture',
    order: 6,
    active: true,
  },
  // {
  //   id: 'philosophy',
  //   title: '철학',
  //   subtitle: '삶과 가치에 대한 깊은 생각을 나눠요.',
  //   iconKey: 'philosophy',
  //   order: 8,
  //   active: true,
  // },
];
