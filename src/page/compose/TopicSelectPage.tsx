import { useNavigate, useParams } from 'react-router-dom';
import TopicCard from '../../components/compose/TopicCard';

const DAILY_TOPICS = [
  { id: '일기', title: '일기 쓰기', desc: '가볍게 하루를 기록해요.' },
  { id: '자유', title: '자유 글쓰기', desc: '자유롭게 생각을 풀어보세요.' },
];

const WORK_TOPICS = [
  { id: '회의록', title: '회의록 작성하기', desc: '도전하게 정리하는 글.' },
  { id: '이메일', title: '이메일 작성하기', desc: '업무 메일처럼 깔끔하게.' },
  { id: '보고서', title: '보고서 작성하기', desc: '명확하게 구조 잡기.' },
];

export default function TopicSelectPage() {
  const navigate = useNavigate();
  const { mode } = useParams(); // 'daily' | 'work'

  const list = mode === 'work' ? WORK_TOPICS : DAILY_TOPICS;

  return (
    <section>
      <h1 className="text-lg font-semibold mt-2 mb-6">
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
