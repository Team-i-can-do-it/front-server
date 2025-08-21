import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className=" px-0">
      {/* 배경은 section 전체로 */}
      <div className="bg-violet-50 mx-auto w-full max-w-[390px] pt-[calc(env(safe-area-inset-top)+44px)] pb-8">
        <div className="px-6">
          <p className="text-2xl font-semibold text-violet-300">LOGO</p>
          <p className="mt-2 mb-9.5 text-[20px] font-semibold">
            오늘은 어떤 문장을 만들어 볼까요?
          </p>

          <div className="mt-6">
            <p className="text-base font-semibold text-[#242424]">
              말하기 연습 시작하기
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {/* 주제 말하기 버튼 */}
              <button
                onClick={() => navigate('/compose/topic')}
                className="flex flex-col items-center justify-center w-[165px] gap-5 p-5 rounded-2xl bg-white cursor-pointer"
              >
                {/* 태그 */}
                <div className="flex w-full gap-1">
                  <div className="h-5 py-1 px-2 flex items-center self-start rounded-lg bg-violet-50 text-violet-400 text-xs">
                    순발력
                  </div>
                  <div className="h-5 py-1 px-2 flex items-center self-start rounded-lg bg-[#f0f0f0] text-[#8e8e8e] text-xs">
                    5분
                  </div>
                </div>

                <div className="flex justify-center bg-yellow-200 w-[62px] h-[62px] rounded-xl" />
                <div className="flex flex-col gap-1 items-center">
                  <div className="font-semibold text-lg">주제 말하기</div>
                  <div className="text-[13px] text-gray-500 whitespace-nowrap">
                    분야별 주제로 즉흥 말하기
                  </div>
                </div>
              </button>
              {/* 비즈니스 버튼 */}
              <button
                onClick={() => navigate('/compose/sentence')}
                className="flex flex-col items-center justify-center w-[165px] gap-5 p-5 rounded-2xl bg-white cursor-pointer"
              >
                {/* 태그 */}
                <div className="flex w-full gap-1">
                  <div className="h-5 py-1 px-2 flex items-center self-start rounded-lg bg-violet-50 text-violet-400 text-xs">
                    창의력
                  </div>
                  <div className="h-5 py-1 px-2 flex items-center self-start rounded-lg bg-[#f0f0f0] text-[#8e8e8e] text-xs">
                    시간제한X
                  </div>
                </div>

                <div className="flex justify-center bg-yellow-200 w-[62px] h-[62px] rounded-xl" />
                <div className="flex flex-col gap-1 items-center">
                  <div className="font-semibold text-lg">문장 만들기</div>
                  <div className="text-[13px] text-gray-500 whitespace-nowrap">
                    단어 연결로 이야기 만들기
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-7 px-6 pt-8 ">
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="text-base font-semibold">현재 진행중인 말하기</p>
              <button className="flex items-center text-sm text-gray-400 gap-1">
                전체보기
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-row">
              <button className="p-4 flex flex-row items-center w-full rounded-2xl border-1 border-[#F2F3F5] gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-200" />
                <div className="flex flex-col text-start">
                  <p className="text-base font-medium">만약 오늘 멸망한다면?</p>
                  <p className="text-[15px] text-gray-200">
                    2025년 8월 21일 17:20분
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-7.5">
          <p className="text-base font-semibold">이런 건 어때요?</p>
          <div className="flex flex-row">
            <button className="p-4 flex flex-row items-center w-full rounded-2xl border-1 border-[#F2F3F5] gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-200" />
              <div className="flex flex-col text-start">
                <p className="text-base font-medium">
                  내 인생, 영화로 만든다면 장르는?
                </p>
                <p className="text-[15px] text-gray-200">문화·예술</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
