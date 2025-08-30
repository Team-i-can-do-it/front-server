import { useNavigate } from 'react-router-dom';
import { useTopicCategories } from '@_hooks/useTopicCategories';
import { TOPIC_GRAPHIC_ICON_MAP } from './topic/iconMap';

export default function TopicSelectPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTopicCategories();

  const topics = Array.isArray(data) ? data : [];

  const handleSelect = (id: string) => {
    navigate(`/compose/topic/${id}`);
  };

  return (
    <section className="mx-auto">
      <div className="flex flex-col gap-6">
        <div className="fixed w-full pb-2 bg-white/95 backdrop-blur flex items-center">
          <h2 className="px-6 typo-h2-sb-20">어떤 주제를 선택해 볼까요?</h2>
        </div>
        {isLoading && (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="h-[82px] bg-gray-25 animate-pulse" />
            ))}
          </ul>
        )}

        {!isLoading && topics.length > 0 && (
          <ul className="w-full flex flex-col pt-9">
            {topics.map((topic) => (
              <li key={topic.id}>
                <button
                  onClick={() => handleSelect(topic.id)}
                  className="w-full px-6 flex items-center gap-4 py-4 rounded-2xl bg-white active:scale-[0.99] transition
                  hover:bg-gray-25 hover:rounded-2xl"
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-10 flex items-center justify-center">
                      <img
                        src={
                          TOPIC_GRAPHIC_ICON_MAP[topic.iconKey] ??
                          TOPIC_GRAPHIC_ICON_MAP['balance']
                        }
                        alt={`${topic.id} 이미지`}
                      />
                    </div>
                    <div className="flex flex-col text-left gap-1">
                      <div className="typo-h4-sb-16">{topic.title}</div>
                      <div className="typo-body2-r-16 text-gray-500">
                        {topic.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {isError && (
          <p className="mt-4 text-red-500 typo-body3-r-14">
            주제를 불러올 수 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}
