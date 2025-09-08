import Lottie from 'react-lottie-player';

type MbtiCardProps = {
  /** 로티 JSON */
  lottieData?: object;
  /** 닉네임(예: 똑똑한 치와와) */
  mbitName: string;
  /** 말풍선 텍스트 */
  summary: string;
  /** 섹션 제목 커스텀 */
  title?: string;
};

export default function MbtiCard({
  lottieData,
  mbitName,
  summary,
  title = '내 말하기 MBTI는?',
}: MbtiCardProps) {
  return (
    <section className="">
      <div className="flex flex-col items-center">
        {lottieData && (
          <div className="w-[180px] h-[180px]">
            <Lottie
              loop
              play
              animationData={lottieData}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}

        <p className="typo-label3-m-14 text-text-500 mt-[10px]">{title}</p>
        <p className="typo-h2-sb-20 text-brand-violet-500 mt-1 mb-[26px]">
          {mbitName}
        </p>

        {/* 말풍선 */}
        <div
          className="
                  relative w-4xs bg-brand-violet-50 rounded-xl
                  shadow-[0_13px_36px_0_rgba(241,234,251,0.12),_0_0_36px_2px_rgba(241,234,252,1)]
                  after:content-[''] after:absolute after:block after:w-0 after:h-0
                  after:border-solid after:border-t-0 after:border-r-[15px] after:border-b-[25px] after:border-l-[15px]
                  after:border-b-violet-50 after:border-x-transparent
                  after:top-[-20px] after:left-[40px]
                "
        >
          <p className="max-w-[318px] typo-body3-r-14 text-text-700 py-5 px-4">
            {summary}
          </p>
        </div>
      </div>
    </section>
  );
}
