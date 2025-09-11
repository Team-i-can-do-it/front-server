export default function SiginUpPage() {
  return (
    <main className="mt-9">
      <div className="flex flex-col items-start gap-10 px-6">
        <div>
          <h1 className="typo-h2-sb-20 text-text-900">
            이메일 인증을 해주세요
          </h1>
        </div>
        <div className="flex flex-col gap-9 w-full relative">
          <div className="flex flex-col gap-3">
            <p className="typo-label2-r-14 text-700">아이디</p>
            <div className="flex justify-between border-b-2 border-gray-100 pb-2">
              <input
                className="typo-body2-r-16 w-2/3 outline-none placeholder:text-text-100"
                placeholder="아이디 (이메일)"
              ></input>
              <button className="py-1 px-2 h-7 rounded-[9px] bg-icon-25 text-text-100 typo-label3-m-14 cursor-pointer">
                인증코드 전송
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="typo-label2-r-14 text-700">인증코드</p>
            <div className="flex justify-between border-b-2 border-gray-100 pb-2">
              <input
                className="typo-body2-r-16 w-2/3 outline-none placeholder:text-text-100"
                placeholder="인증코드를 입력해주세요"
              ></input>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div
        className="fixed bottom-0 z-50 w-[min(100vw,var(--mobile-w))] px-6
        pb-10 py-3 bg-white border-t border-border-25"
      >
        <button
          // onClick={() => setOpen(true)}
          className="w-full typo-button-b-16 py-3 rounded-xl cursor-pointer
        bg-material-dimmed
        hover:bg-brand-violet-500 text-white 
        transition-colors duration-200 ease-out"
        >
          완료
        </button>
      </div>
    </main>
  );
}
