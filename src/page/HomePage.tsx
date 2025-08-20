import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function HomePage() {
  return (
    <section className=" px-0">
      {/* 배경은 section 전체로 */}
      <div className="bg-violet-50 mx-auto w-full max-w-[390px] pt-[calc(env(safe-area-inset-top)+44px)] pb-8">
        {/* 여기에만 px-6 주면 돼 */}
        <div className="px-6">
          <p className="text-2xl font-semibold text-violet-300">LOGO</p>
          <p className="mt-2 mb-9.5 text-[20px] font-semibold">
            오늘은 어떤 문장을 만들어 볼까요?
          </p>

          <div className="mt-6">
            <p className="text-base text-[#242424]">글쓰기 시작하기</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center h-51 gap-7 p-5 rounded-2xl bg-white">
                {/* 태그 */}
                <div className="h-5 py-1 px-2 flex items-center justify-start self-start rounded-lg bg-violet-50 text-violet-400 text-xs">
                  데일리
                </div>
                <div className="flex justify-center bg-yellow-200 w-15 h-15 rounded-xl" />
                <div className="font-semibold text-lg">일상용 글쓰기</div>
              </button>
              <button className="flex flex-col items-center justify-center h-51 gap-7 p-5 rounded-2xl bg-white shadow-">
                <div className="h-5 py-1 px-2 flex items-center justify-start self-start rounded-lg bg-violet-50 text-violet-400 text-xs">
                  비즈니스
                </div>
                <div className="flex justify-center bg-yellow-200 w-15 h-15 rounded-xl" />
                <div className="font-semibold text-lg">업무용 글쓰기</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pt-8">
        <div className="flex flex-col gap-4 pb-7.5">
          <p className="text-base font-semibold">이런 건 어때요?</p>
          <div className="flex flex-row">
            <button className="p-4 flex flex-row items-center w-full rounded-2xl border-1 border-[#F2F3F5] gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-200" />
              <div className="flex flex-col text-start">
                <p className="text-base">단어로 문장 만들기</p>
                <p className="text-[15px] text-gray-200">
                  주어진 단어로 자유롭게 써보세요
                </p>
              </div>
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <p className="text-base font-semibold">현재 진행중인 글쓰기</p>
            <button className="flex items-center text-sm text-gray-400 gap-1">
              전체보기
              <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
