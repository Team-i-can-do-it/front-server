export default function SummaryPanel() {
  const total = 90;
  const feedback =
    '핵심 문장을 앞에 배치해 가독성이 좋습니다. 예시가 구체적이며, 결론이 명확합니다. 중간 연결 문장을 한두 개만 더 보완하면 더 매끄러워질 거예요.';
  const tags = ['감성형', '정보형', '차분형'];

  return (
    <div>
      {/* 타이틀 & 점수 */}
      <div className="pt-5">
        <p className="text-base font-semibold">
          내 말하기 실력, 얼마나 좋을까?
        </p>
        <div className="mt-3 mb-4">
          <div className="text-sm font-semibold text-gray-400">
            도넛님의 점수는
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-[28px] font-semibold">{total}점</div>
            <div className="text-lg text-violet-500 font-semibold">
              뉴본 베이비
            </div>
          </div>
        </div>
      </div>

      {/* 썸네일/프리뷰 영역 */}
      <div className="mx-auto my-12 rounded-2xl bg-[#FFF6CC] h-42 w-42" />

      {/* 피드백 */}
      <div className="border-b border-[#f2f3f5] pb-5">
        <p className="text-base font-semibold mb-2">AI 기반 맞춤 피드백</p>
        <p className="text-base text-[#6b7684] leading-6">{feedback}</p>
      </div>
      {/* 성향 태그 */}
      <div className="mt-5">
        <div className="flex items-center gap-1">
          <p className="text-base font-semibold">도넛님 글쓰기 성향</p>
          <span className="text-gray-400 text-xs"></span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 h-7 inline-flex items-center rounded-full text-sm bg-violet-50 text-violet-500"
            >
              # {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
