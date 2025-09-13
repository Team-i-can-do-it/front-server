import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { useNavigate } from 'react-router-dom';

interface Step3Props {
  name: string;
}
export default function Step3({ name }: Step3Props) {
  const [dog, setDog] = useState<object>();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      const mod = await import('@_characters/mbti1.json');

      if (!alive) return;
      setDog(mod.default);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('/welcome', { replace: true });
    }, 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-between gap-14 pt-13">
      <div className="w-40 h-60">
        {dog && (
          <Lottie
            loop
            play
            animationData={dog}
            style={{ width: '100%', height: '140%' }}
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center">
          <h2 className="typo-h1-b-24 text-brand-violet-500">{name}님,</h2>
          <p className="typo-h1-b-24 text-[#242424]">
            회원가입이 완료되었습니다.
          </p>
        </div>
      </div>

      <div>
        <p className="typo-body1-r-15 text-gray-500">
          이음과 함께 새로운 여정을 시작해 보세요.
        </p>
      </div>
    </div>
  );
}
