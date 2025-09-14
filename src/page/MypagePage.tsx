import ItemList from '@_components/pageComponent/mypage/ItemList';
import type { ScrapItem } from '@_components/pageComponent/mypage/ScrapBook';
import ScrapBook from '@_components/pageComponent/mypage/ScrapBook';
import { useNavigate } from 'react-router-dom';
import avata from '@_icons/graphics/daily.svg';
import useModalStore from '@_store/dialogStore';
import { useToast } from '@_hooks/useToast';
import { useMyPage } from '@_hooks/useMyPage';
import { useAuthStore } from '@_store/authStore';

import { useMemberMbti } from '@_hooks/useMemberMbti';
import {
  MBTI_IMAGES,
  MBTI_NAMES,
  ALL_CODES,
  type MbtiCode,
} from '@_constants/mbti/imageMap';
import { useMyMbti } from '@/hooks/useMyMbti';

const SCRAP_MOCK: ScrapItem[] = [
  { id: '1', title: '정보', subtitle: '나만의 블로그' },
  { id: '2', title: '정보', subtitle: '나만의 블로그' },
  { id: '3', title: '정보', subtitle: '나만의 블로그' },
  { id: '4', title: '정보', subtitle: '나만의 블로그' },
];

export default function MypagePage() {
  const navigate = useNavigate();
  const { open } = useModalStore();
  const toast = useToast();
  const clearAuth = useAuthStore((s) => s.clear);

  const { isLoading, isError, error } = useMyPage();

  const { data: myPage } = useMyPage();
  const { data: myMbti } = useMyMbti();

  const name = myPage?.name ?? '이음';
  const point = myPage?.point ?? 0;

  const latestCode: MbtiCode | undefined =
    myMbti?.latest ?? myMbti?.representative ?? myMbti?.owned?.[0];

  const mbtiNameForDisplay = latestCode
    ? MBTI_NAMES[latestCode]
    : '나만의 mbti를 찾아보세요';

  const avatarSrc = latestCode ? MBTI_IMAGES[latestCode] : avata;

  const handleLogout = () => {
    open({
      title: '로그아웃 하시겠습니까?',
      description: (
        <span className="block w-full whitespace-pre-line">
          로그아웃하면 다시 {'\n'}로그인해야 서비스를 이용할 수 있어요.
        </span>
      ),
      buttonLayout: 'doubleRedCancel',
      cancelText: '취소',
      confirmText: '로그아웃',
      onConfirm: () => {
        clearAuth();
        navigate('/welcome', { replace: true });
        toast('로그아웃 되었습니다.', 'success');
        return;
      },
    });
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-[min(100vw,390px)] bg-white-base mb-16">
        <div className="animate-pulse p-6">
          <div className="mx-auto h-[90px] w-[90px] rounded-full bg-bg-10" />
          <div className="mt-4 h-4 w-24 mx-auto rounded bg-bg-10" />
          <div className="mt-2 h-3 w-32 mx-auto rounded bg-bg-10" />
          <div className="mt-6 h-12 rounded-[20px] bg-bg-10" />
        </div>
      </main>
    );
  }

  if (isError) {
    // @ts-ignore: axios error guard 없이 간단 처리
    const status = error?.response?.status;
    if (status === 401) {
      // 인증 만료: 세션 정리 후 이동
      clearAuth();
      navigate('/welcome', { replace: true });
      toast('로그인이 필요합니다.', 'error');
      return null;
    }
    return (
      <main className="mx-auto w-[min(100vw,390px)] bg-white-base mb-16">
        <div className="p-6 text-center text-status-danger">
          마이페이지 정보를 불러오지 못했습니다.
        </div>
      </main>
    );
  }
  return (
    <main className="mx-auto w-[min(100vw,390px)] bg-white-base mb-16">
      <div className="flex flex-col items-center justify-between bg-bg-10">
        {/* 아바타 */}
        <div className="flex flex-col items-center gap-3 pb-8">
          <img
            src={avatarSrc}
            alt={mbtiNameForDisplay}
            className="rounded-full h-[90px] w-[90px] object-cover bg-white"
          />
          <div className="flex flex-col items-center gap-1">
            <p className="typo-h3-sb-18">{name}</p>
            <p className="typo-label3-m-14 text-brand-violet-500">
              {mbtiNameForDisplay}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pb-6 w-full px-6">
          {/* 내 포인트 */}
          <button
            type="button"
            onClick={() => navigate('/mypage/mypoint')}
            className="w-full flex items-center justify-between cursor-pointer
            gap-2 rounded-[20px] px-6 h-12 
            bg-white-base border border-[#f2f3f5] text-text-500 typo-label3-m-14
          active:scale-[0.99] hover:bg-bg-10 hover:border-border-25"
          >
            내 포인트
            <span className="typo-label3-m-14 text-brand-violet-500">
              {point} point
            </span>
          </button>
        </div>
      </div>

      <div className="px-6 bg-white-base">
        {/* 스크랩북 */}
        <ScrapBook items={SCRAP_MOCK} className="mt-4" onClickItem={() => {}} />
        {/* 구매내역~피드백보내기 */}
        <ItemList
          className="mt-5"
          onClickPurchaseHistory={() => navigate('/mypage/purchase')}
          onClickMbti={() => navigate('/mypage/mbti')}
          onClickNotice={() => navigate('/mypage/notice')}
          onClickSupport={() => navigate('/mypage/support')}
          onClickFeedback={() => navigate('mypage/feedback')}
        />
        {/* 로그아웃 버튼 */}
        <div className="mt-4 rounded-lg border border-[#efefef]  overflow-hidden bg-white-base">
          <button
            onClick={handleLogout}
            className="w-full h-[52px] px-4 text-left cursor-pointer
            text-status-danger typo-body2-r-16
            active:scale-[0.995] transition-[transform,background-color] 
            duration-150 hover:bg-bg-10"
          >
            로그아웃
          </button>
        </div>
      </div>
    </main>
  );
}
