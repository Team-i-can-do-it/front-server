import VioletTag, { GrayTag, WhiteTextTag } from '@_components/common/Tag';
import Lottie from 'react-lottie-player';
import logo from '@_icons/logo/logo.svg';
import { useEffect, useState } from 'react';

export default function DesignTest() {
  const [dog1, setDog1] = useState<object | null>(null);
  const [dog3, setDog3] = useState<object | null>(null);
  const [cat1, setCat1] = useState<object | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [d1, d3, c1] = await Promise.all([
        import('../assets/characters/dog.json'),
        import('../assets/characters/dog.v3.json'),
        import('../assets/characters/cat1.json'),
      ]);
      if (!alive) return;
      setDog1(d1.default);
      setDog3(d3.default);
      setCat1(c1.default);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!dog1 || !dog3 || !cat1)
    return (
      <div className="w-full h-[201px] md:h-[467px] lg:h-[336px] flex items-center justify-center">
        <img
          src={logo}
          alt="loading"
          width={50}
          height={50}
          className="animate-spin"
        />
      </div>
    );
  return (
    <>
      <GrayTag label="# 감정형" />
      <VioletTag label="보라색" />
      <WhiteTextTag label="보라색" />

      <div className="w-[173.5px] h-[216.3px]">
        <Lottie
          loop
          animationData={dog1}
          play
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="w-[173.5px] h-[216.3px]">
        <Lottie
          loop
          animationData={dog3}
          speed={1.2}
          play
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="w-[173.5px] h-[216.3px]">
        <Lottie
          loop
          animationData={cat1}
          speed={1}
          play
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </>
  );
}
