import { useNavigate } from 'react-router-dom';

import { TOPIC_GRAPHIC_ICON_MAP } from '../constants/topic/iconMap';
import { MOCK_TOPICS } from '@_hooks/useTopicCategories';

export default function TopicSelectPage() {
  const navigate = useNavigate();

  const topics = MOCK_TOPICS;

  const handleSelect = (id: string) => {
    navigate(`/compose/topic/${id}`);
  };

  return (
    <section className="mx-auto w-full max-w-[var(--mobile-w,390px)]">
      <div className="flex flex-col gap-6">
        <div
          className="fixed z-40 w-full max-w-[var(--mobile-w,390px)]"
          style={{
            top: 'calc(var(--header-h,44px) + env(safe-area-inset-top,0px))',
          }}
        >
          <div className="sticky top-0 z-40">
            <div className="pb-2 bg-white/95 backdrop-blur">
              <h2 className="px-6 typo-h2-sb-20">어떤 주제를 선택해 볼까요?</h2>
            </div>
          </div>
        </div>

        {/* 로딩 */}

        {/* 목록 */}
        {topics.length > 0 && (
          <ul className="w-full flex flex-col pt-12">
            {topics.map((topic) => (
              <li key={topic.id}>
                <button
                  onClick={() => handleSelect(topic.id)}
                  className="w-full px-6 flex items-center gap-4 py-4 bg-white active:scale-[0.99] transition hover:bg-gray-25 cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-10 flex items-center justify-center">
                      <img
                        className="max-w-full max-h-full"
                        src={
                          TOPIC_GRAPHIC_ICON_MAP[topic.iconKey] ??
                          TOPIC_GRAPHIC_ICON_MAP.balance
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
      </div>
    </section>
  );
}
