import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const [cryDog, setCryDog] = useState<object>();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      const [cryDog] = await Promise.all([
        import('@_characters/dog.crying.json'),
      ]);
      if (!alive) return;
      setCryDog(cryDog.default);
    })();
  }, []);

  const handleGoHome = () => {
    navigate('/welcome');
  };

  return (
    <div className="flex flex-col items-center justify-between gap-5 pt-13">
      <div className="w-40 h-60">
        <Lottie
          loop
          animationData={cryDog}
          play
          style={{ width: '100%', height: '140%' }}
        />
      </div>
      <div className="flex flex-col items-center justify-between gap-2">
        <h2 className="typo-h2-sb-20">페이지를 찾을 수 없습니다</h2>
        <p className="typo-label4-m-12 text-text-200">
          죄송합니다 더이상 존재하지 않는 페이지입니다
        </p>
      </div>
      <div
        className="flex items-center justify-center
      w-56 h-15 px-[26px] py-2 rounded-xl
      bg-brand-violet-50 text-brand-violet-500 typo-button-b-16
      hover:bg-brand-violet-100"
      >
        <button className="w-56 h-15  cursor-pointer" onClick={handleGoHome}>
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
