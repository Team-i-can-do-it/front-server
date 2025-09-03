import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';

import googleLogo from '@_icons/common/icon-google.svg';
import { useEffect, useState } from 'react';

export default function WelcomePage() {
  const [dog1, setDog1] = useState<object>();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    console.log('구글 로그인 버튼 클릭');
    navigate('/e-eum');
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const [d1] = await Promise.all([import('@_characters/dog.json')]);
      if (!alive) return;
      setDog1(d1.default);
    })();
  }, []);

  return (
    <main
      className="w-full max-w-[var(--mobile-w,390px)] mx-auto 
    flex flex-col items-center justify-center min-h-[100dvh]"
    >
      <div className="w-[125px] h-[127px] mb-10">
        <Lottie
          loop
          animationData={dog1}
          play
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="flex flex-col text-center gap-6 mb-32">
        <h1 className="typo-h1-b-24">OOO에 오신 것을 환영해요 :)</h1>
        <p className="typo-body1-r-15 text-gray-500">
          처음부터 잘할 필요 없어요. <br /> 꾸준히 할 수 있게 도와드릴게요.
        </p>
      </div>
      <div className="w-full flex justify-center">
        <button
          onClick={handleGoogleLogin}
          className="w-full max-w-[328px]
          flex items-center justify-center
           bg-[#Efe6ff] text-brand-violet-500 hover:text-brand-violet-600 
            h-12 p-4 rounded-xl
            typo-button-b-16 gap-2 cursor-pointer
            transition-all duration-150 hover:bg-violet-100 hover:shadow-sm active:translate-y-[1px]"
        >
          <img src={googleLogo} alt="구글 로그인 로고" className="w-5 h-5" />
          구글로 로그인하기
        </button>
      </div>
    </main>
  );
}
