import { useNavigate, useParams } from 'react-router-dom';
import TopicCard from '../../components/compose/TopicCard';

const TOPIC_TOPICS = [
  {
    id: '추천 밸런스 게임',
    title: (
      <>
        <span className="text-violet-500 font-semibold">추천</span> 밸런스 게임
      </>
    ),
    desc: '명확하게 구조 잡는 글을 연습해 보세요.',
  },
  {
    id: '일상·취미',
    title: '일상·취미',
    desc: '가볍게 오늘 있었던 일이나 취미를 이야기해요',
  },
  {
    id: '자유',
    title: '사회·정치',
    desc: '사회 이슈와 정치적 관점을 나눠 말해요.',
  },
  {
    id: '자유',
    title: '가상·상상력',
    desc: '상상 속 상황이나 가상의 세계를 표현해요.',
  },
  {
    id: '자유',
    title: '경제·비즈니스',
    desc: '돈, 투자, 회사 일에 대해 생각을 말해요.',
  },
  {
    id: '자유',
    title: '기술·미래',
    desc: '최신 기술과 미래 변화에 대해 이야기해요.',
  },
  {
    id: '자유',
    title: '문화·예술',
    desc: '영화, 음악, 전시 같은 문화 경험을 말해요.',
  },
  { id: '자유', title: '철학', desc: '삶과 가치에 대한 깊은 생각을 나눠요.' },
];

const SENTENCE_TOPICS = [
  {
    id: '긴 문장',
    title: '길고 긴..취준..',
    desc: '어떻게 하면 이 기간을 끝낼 수 있을까',
  },
  {
    id: '배가 아픈 이 시간',
    title: '배가 아픈 이 시간',
    desc: '원래 이렇게 시간이 느리게 갔었나?',
  },
  { id: '쉬는시간', title: '쉬는시간', desc: '신이만든 시간' },
];

export default function TopicSelectPage() {
  const navigate = useNavigate();
  const { mode } = useParams(); // 'topic' | 'sentence'

  const list = mode === 'sentence' ? SENTENCE_TOPICS : TOPIC_TOPICS;

  return (
    <section>
      <h1 className="text-xl font-semibold mt-6 mb-6">
        어떤 주제를 선택해 볼까요?
      </h1>

      <div className="flex flex-col">
        {list.map((t) => (
          <TopicCard
            key={t.id}
            title={t.title}
            desc={t.desc}
            onClick={() => navigate(`write?topic=${t.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
