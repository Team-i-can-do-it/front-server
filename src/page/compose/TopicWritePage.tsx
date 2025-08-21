import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import select_topic from '../../assets/select_topic.svg';

export default function TopicWritePage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const topic = sp.get('topic') || '';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsEditing(false);
  };
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  // 제목 1자 이상, 본문 1자 이상 작성
  const canSubmit = title.trim().length >= 1 && content.trim().length >= 1;

  return (
    <section className="pt-3 pb-[88px]">
      {/* 상단 메타 영역 */}
      <div className="flex items-start gap-3 py-3">
        <div className="w-12 h-12 rounded-xl bg-yellow-200 shrink-0" />
        <div className="flex-1">
          {/* 제목 + 연필 */}
          <div className="flex items-center gap-1">
            {isEditing ? (
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder="주제를 작성해주세요"
                className="flex-1 min-w-0 text-base leading-7 font-medium bg-transparent outline-none
                           placeholder:text-black caret-violet-500"
              />
            ) : (
              <button
                type="button"
                aria-label="제목 편집"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 active:scale-95 transition"
              >
                <span className="text-base leading-7 font-medium">
                  {title || '주제를 작성해주세요'}{' '}
                </span>
                <img
                  src={select_topic}
                  className="h-5 w-5"
                  alt="주제 선택 버튼"
                />
              </button>
            )}
          </div>

          {/* 서브텍스트 */}
          <p className="mt-1 text-[15px] text-gray-500">{topic}</p>
        </div>
      </div>

      {/* 얇은 구분선 */}
      <hr className="mb-4 border-t border-[#f2f3f5]" />

      {/* 본문 입력 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="오늘은 어떤 회의를 했었나요?"
        className="w-full min-h-[260px] resize-none bg-transparent outline-none
               placeholder:text-gray-50 placeholder:text-base font-light caret-violet-500
               "
      />

      {/* 하단 제출버튼 */}
      <div
        className="fixed left-0 right-0 bottom-0 border-t bg-white/90 backdrop-blur h-12"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="h-full flex items-center">
          <button
            disabled={!canSubmit}
            onClick={() => navigate(`../result?topic=${topic}`)}
            className={`w-full p-4 font-semibold ${
              canSubmit
                ? 'bg-violet-500 text-white'
                : 'bg-[#f2f3f5] text-gray-300'
            }`}
          >
            작성 완료
          </button>
        </div>
      </div>
    </section>
  );
}
