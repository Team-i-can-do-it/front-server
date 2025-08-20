import loginImage from '../assets/loginImage.svg';
import googleLogo from '../assets/googleLogo.svg';

export default function MainPage() {
  return (
    <>
      <div>
        <div className="flex flex-col items-center justify-center mt-32">
          <div>
            <img src={loginImage} alt="메인 이미지" className="w-61 h-40"></img>
          </div>
          <div className="flex flex-col text-center gap-6 mb-32">
            <p className="text-[24px] font-semibold">
              OOO에 오신 것을 환영해요 :)
            </p>
            <p className="text-[15px] text-gray-500 font-light">
              완벽하지 않아도 괜찮아요. <br /> 꾸준히 쓸 수 있도록 저희가
              함께할게요.
            </p>
          </div>
          <div>
            <button
              onClick={() => console.log('구글 로그인 버튼 클릭')}
              className="flex items-center justify-center bg-violet-50 text-violet-500 w-80 h-12 p-4 rounded-xl
            text-base font-semibold gap-2 cursor-pointer"
            >
              <img
                src={googleLogo}
                alt="구글 로그인 로고"
                className="w-5 h-5"
              />
              구글로 로그인하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
