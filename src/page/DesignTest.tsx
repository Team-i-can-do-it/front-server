import VioletTag, { GrayTag, WhiteTextTag } from '@_components/common/Tag';
import Lottie from 'react-lottie-player';
import logo from '@_icons/logo/logo.svg';
import { useEffect, useState } from 'react';

export default function DesignTest() {
  const [animationData, setAnimationData] = useState<object>();
  useEffect(() => {
    import('../assets/characters/dog.json').then((data) => {
      setAnimationData(data.default); // dynamic import일 땐 .default 필요
    });
  }, []);

  if (!animationData)
    return (
      <div className="w-fll h-[201px] md:h-[467px] lg:h-[336px] flex items-center justify-center">
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
          animationData={animationData}
          play
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </>
  );
}
