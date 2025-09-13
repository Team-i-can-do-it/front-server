import VioletTag, { GrayTag, WhiteTextTag } from '@_components/common/Tag';
import Lottie from 'react-lottie-player';
import logo from '@_icons/logo/logo.svg';
import { useEffect, useState } from 'react';
import useModalStore from '@_store/dialogStore';
import { useNavigate } from 'react-router-dom';
import RadarChart from '@_components/pageComponent/result/analysis/RadarChart';
import DetailCard from '@_components/pageComponent/result/analysis/DetailCard';
import RelatedTopic from '@_components/pageComponent/result/analysis/RelatedTopic';

export default function DesignTest() {
  const [dog1, setDog1] = useState<object | null>(null);
  const [dog3, setDog3] = useState<object | null>(null);
  const [cat1, setCat1] = useState<object | null>(null);

  const { alert, confirm } = useModalStore();
  const navigate = useNavigate();

  // ====== 차트 ======
  const labels = ['주제 명료성', '표현력', '완성도', '내용 충실성', '논리성'];
  const scores = [82, 71, 64, 77, 69];

  const details = [
    {
      title: '주제 명료성',
      summary:
        '핵심 주제를 비교적 명확히 제시했어요. 앞부분에서 논지 선언이 좋아요.',
    },
    {
      title: '표현력',
      summary:
        '비유/강조 표현이 자연스러웠습니다. 다만 군더더기 어투를 조금 덜어내면 더 좋아요.',
    },
    {
      title: '완성도',
      summary:
        '서론-본론-결론 구조가 살아있습니다. 결론에서 요약 문장을 한 줄만 더 보강해보세요.',
    },
    {
      title: '내용 충실성',
      summary:
        '예시가 구체적이라 설득력이 있었어요. 반례도 1개 정도 추가하면 더욱 탄탄합니다.',
    },
    {
      title: '논리성',
      summary:
        '근거-주장의 연결이 대체로 자연스럽습니다. 접속어 사용을 조금 더 간결하게!',
    },
  ];

  const reads = [
    {
      id: '1',
      title: '핵심 주제 뾰족하게 잡는 법 3가지',
      thumbnailUrl: 'https://picsum.photos/seed/a/300/180',
      href: '#',
    },
    {
      id: '2',
      title: '예시/반례로 논증 강화하는 실전 팁',
      thumbnailUrl: 'https://picsum.photos/seed/b/300/180',
      href: '#',
    },
    {
      id: '3',
      title: '결론 한 문장으로 설득 끝내기',
      thumbnailUrl: 'https://picsum.photos/seed/c/300/180',
      href: '#',
    },
  ];

  // ====== 모달 ======

  // 1) 주문 확인 (두 버튼)
  const openOrderConfirm = () => {
    confirm({
      title: '주문 확인',
      description: (
        <>
          5,000P를 사용하여 구매하시겠어요?
          <br />
          결제 후 잔액 200P
        </>
      ),
      confirmText: '구매하기',
      cancelText: '취소',
      onConfirm: () => {
        // 결제 로직 ~~~
        console.log('구매 진행');
      },
    });
  };

  // 2) 결제 완료 (한 버튼)
  const openPaymentDone = () => {
    alert({
      title: '결제가 완료되었습니다',
      description:
        '주문이 정상적으로 완료되었습니다.\n상세 내역은 마이페이지에서 확인해 주세요.',
      confirmText: '닫기',
    });
  };

  // 3) 정말 제출하시겠어요? (두 버튼, 회색 취소 버튼)
  const openSubmitConfirm = () => {
    confirm({
      title: '정말 제출하시겠어요?',
      description: '제출된 원고는 수정이 불가능해요',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => console.log('제출 진행'),
    });
  };

  // 4) 당첨자 발표 (태그 + 한 버튼)
  const openWinner = () => {
    alert({
      title: '당첨자 발표',
      tag: { text: '정*연님' },
      description: '당첨을 축하합니다🎉',
      confirmText: '확인',
    });
  };

  // 5) 포인트 보기 모달
  const openPointConfirm = () => {
    useModalStore.getState().open({
      title: '000P가 지급되었어요🎉',
      description: '포인트는 마이페이지에서 확인가능해요',
      buttonLayout: 'doubleVioletCancel', // ← 왼쪽 연보라 + 오른쪽 보라
      cancelText: '포인트 보기', // ← 왼쪽 버튼
      confirmText: '확인', // ← 오른쪽 버튼
      onCancel: () => navigate('/mypage/points'), // 경로는 프로젝트 맞게
    });
  };

  // 6) 종료 확인 모달
  const openExitConfirm = () => {
    useModalStore.getState().open({
      title: '정말 나가시겠어요?',
      description: (
        <span className="block w-full text-left whitespace-pre-line">
          지금까지 연습했던 내용은 저장되지 않아요.
          {'\n'}내용을 모두 지우고 나가시겠어요?
        </span>
      ),
      buttonLayout: 'doubleRedCancel',
      cancelText: '이어하기',
      confirmText: '종료하기',
      onConfirm: () => navigate('/e-eum'),
    });
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const [d1, d3, c1] = await Promise.all([
        import('../assets/characters/mbti1.json'),
        import('../assets/characters/dog.loading.json'),
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

      <div>
        <img src="https://ko.wikipedia.org/wiki/%EC%A1%B0%EC%8A%B9%EC%9A%B0" />
      </div>

      <div>
        <img src="https://cdnweb01.wikitree.co.kr/webdata/editor/202509/01/202509011414078187.JPG" />
      </div>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/JTBC_%EB%93%9C%EB%9D%BC%EB%A7%88_%27%EB%9D%BC%EC%9D%B4%ED%94%84%27_%EC%A0%9C%EC%9E%91%EB%B0%9C%ED%91%9C%ED%9A%8C_%EC%A1%B0%EC%8A%B9%EC%9A%B0_%281%29.jpg"
        alt="조승우"
      />

      {/* ===== 모달 테스트 버튼들 ===== */}
      <div className="mt-8 grid grid-cols-2 gap-3 max-w-[390px]">
        <button
          onClick={openOrderConfirm}
          className="h-12 rounded-xl bg-brand-violet-50 text-brand-violet-500 typo-button-b-16 active:scale-[0.99]"
        >
          주문 확인
        </button>
        <button
          onClick={openPaymentDone}
          className="h-12 rounded-xl bg-brand-violet-500 text-white typo-button-b-16 active:scale-[0.99]"
        >
          결제 완료
        </button>
        <button
          onClick={openSubmitConfirm}
          className="h-12 rounded-xl bg-gray-25 text-gray-700 typo-button-b-16 active:scale-[0.99]"
        >
          제출 확인
        </button>
        <button
          onClick={openWinner}
          className="h-12 rounded-xl bg-brand-violet-500 text-white typo-button-b-16 active:scale-[0.99]"
        >
          당첨자 발표(태그)
        </button>

        <button
          onClick={openPointConfirm}
          className="h-12 rounded-xl bg-brand-violet-500 text-white typo-button-b-16 active:scale-[0.99]"
        >
          포인트 지급(보라 버튼)
        </button>

        <button
          onClick={openExitConfirm}
          className="h-12 rounded-xl bg-status-danger text-white typo-button-b-16 active:scale-[0.99]"
        >
          종료 확인 버튼(레드 버튼)
        </button>
      </div>
      <main className="mx-auto py-6 space-y-6">
        <RadarChart name="도넛" labels={labels} scores={scores} />
        <section className="mt-4">
          <ul>
            {details.map((d) => (
              <li key={d.title}>
                <DetailCard title={d.title} summary={d.summary} />
              </li>
            ))}
          </ul>
        </section>
        <RelatedTopic items={reads} />
      </main>
    </>
  );
}
