import Lottie from 'react-lottie-player';

import GoogleLogo from '@_icons/logo/icon-google.svg?react';
import NaverLogo from '@_icons/logo/logo-naver.svg?react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const [dog1, setDog1] = useState<object>();

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

  const goOAuth = (p: 'google' | 'naver') => {
    window.location.href = `${API_BASE}/oauth2/authorization/${p}`;
  };

  const handleGoogleLogin = () => goOAuth('google');
  const handleNaverLogin = () => goOAuth('naver');

  const handleEmailLogin = () => {
    navigate('/signin');
  };
  const handleSignUp = () => {
    navigate('/signup');
  };
  useEffect(() => {
    let alive = true;
    (async () => {
      const [d1] = await Promise.all([import('@_characters/mbti1.json')]);

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
      <div className="flex flex-col text-center gap-6 mb-20">
        <h1 className="typo-h1-b-24">이음에 오신 것을 환영해요 :{')'}</h1>

        <p className="typo-body1-r-15 text-gray-500">
          처음부터 잘할 필요 없어요. <br /> 꾸준히 할 수 있게 도와드릴게요.
        </p>
      </div>
      <div className="w-full flex flex-col gap-[9px] items-center justify-center">
        <button
          onClick={handleGoogleLogin}
          className="w-full max-w-[328px]
          flex items-center justify-center
           bg-[#Efe6ff] text-brand-violet-500 hover:text-brand-violet-600 
            h-12 p-4 rounded-xl
            typo-button-b-16 gap-2 cursor-pointer
            transition-all duration-150 hover:bg-violet-100 hover:shadow-sm active:translate-y-[1px]"
        >
          <GoogleLogo className="h-5 w-5" />
          구글로 로그인하기
        </button>
        <button
          onClick={handleNaverLogin}
          className="w-full max-w-[328px]
          flex items-center justify-center
           bg-[#03C75A] text-white-base
            h-12 p-4 rounded-xl
            typo-button-b-16 gap-2 cursor-pointer
            transition-all duration-150 hover:shadow-sm active:translate-y-[1px]"
        >
          <NaverLogo />
          네이버로 로그인하기
        </button>
        <button
          onClick={handleEmailLogin}
          className="w-full max-w-[328px]
          flex items-center justify-center
           bg-icon-25 text-text-500
            h-12 p-4 rounded-xl
            typo-button-b-16 gap-2 cursor-pointer
            transition-all duration-150 hover:shadow-sm active:translate-y-[1px]"
        >
          이메일로 로그인하기
        </button>

        <button
          onClick={handleSignUp}
          className="mt-2 typo-button-r-14 text-text-700 underline cursor-pointer hover:text-gray-900"
        >
          회원가입
        </button>
      </div>
    </main>
  );
}
