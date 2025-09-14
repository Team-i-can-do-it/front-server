import { useEffect, useMemo } from 'react';
import {
  MBTI_IMAGES,
  MBTI_NAMES,
  ALL_CODES,
  type MbtiCode,
} from '@_constants/mbti/imageMap';
import { useMyMbti } from '@_hooks/useMyMbti';
import { useAuthStore } from '@_store/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@_hooks/useToast';

type Item = { id: MbtiCode; name: string; img: string; locked?: boolean };

export default function MyMBTI() {
  const { data, isLoading, isError, error } = useMyMbti();
  const clearAuth = useAuthStore((s) => s.clear);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.groupCollapsed('[VIEW] MyMBTI data snapshot');
      console.log('data:', data);
      console.log('isLoading:', isLoading, 'isError:', isError);
      console.log('error:', error);
      console.groupEnd();
    }
  }, [data, isLoading, isError, error]);

  const owned = data?.owned ?? [];
  const latest = data?.latest;
  const representative = data?.representative;

  const items: Item[] = useMemo(
    () =>
      ALL_CODES.map((code) => ({
        id: code,
        name: MBTI_NAMES[code],
        img: MBTI_IMAGES[code],
        locked: !owned.includes(code),
      })),
    [owned],
  );

  const repId: MbtiCode | undefined = useMemo(
    () => representative ?? latest ?? owned[0],
    [representative, latest, owned],
  );

  const rep = repId ? items.find((it) => it.id === repId) : undefined;
  const latestId = latest ?? owned[0];

  if (isError) {
    // @ts-ignore axios 가드
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      navigate('/welcome', { replace: true });
      toast('로그인이 필요합니다.', 'error');
      return null;
    }
    return (
      <div className="p-6 text-status-danger">
        MBTI 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-9 mb-20">
      {isLoading ? (
        <div className="p-6">
          <div className="animate-pulse h-20 bg-bg-10 rounded mb-4" />
          <div className="animate-pulse h-40 bg-bg-10 rounded" />
        </div>
      ) : (
        <>
          <TopSection rep={rep} latestId={latestId} />
          <BottomSection items={items} />
        </>
      )}
    </div>
  );
}

function TopSection({ rep, latestId }: { rep?: Item; latestId?: MbtiCode }) {
  return (
    <div className="flex flex-col items-center gap-4 border-b border-border-25">
      <div className="typo-h4-sb-16 text-text-900">나의 대표 mbti</div>
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex items-center justify-center bg-icon-25">
        {latestId && rep ? (
          <img
            src={rep.img}
            alt={rep.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <LockIcon className="w-9 h-9 text-gray-300" />
        )}
      </div>
      <div className="flex flex-col items-center gap-2 mb-9">
        <p className="typo-label3-m-16 text-brand-violet-500">
          {latestId && rep ? rep.name : 'MBTI가 없습니다.'}
        </p>
        <p className="typo-label3-m-14 text-text-200">
          최근 받은 mbti만 대표 mbti로 설정할 수 있어요
        </p>
      </div>
    </div>
  );
}

function BottomSection({ items }: { items: Item[] }) {
  const firstRow = items.slice(0, 2);
  const rest = items.slice(2);
  return (
    <div className="flex flex-col items-center gap-8 mt-9 w-full">
      <ul className="flex justify-center gap-x-10 w-full max-w-[420px]">
        {firstRow.map((item) => (
          <MbtiCard key={item.id} item={item} />
        ))}
      </ul>
      <ul className="grid grid-cols-3 gap-x-10 gap-y-12 w-full max-w-[420px]">
        {rest.map((item) => (
          <MbtiCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function MbtiCard({ item }: { item: Item }) {
  return (
    <li className="flex flex-col items-center">
      <div
        className={[
          'w-20 h-20 rounded-full flex items-center justify-center overflow-hidden',
          item.locked ? 'bg-icon-25' : 'bg-white',
        ].join(' ')}
      >
        {item.locked ? (
          <LockIcon className="w-9 h-9 text-gray-300" />
        ) : (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <span className="mt-3 text-center text-text-500 typo-label4-m-12">
        {item.name}
      </span>
    </li>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-7-2a2 2 0 114 0v2h-4V6zm7 12H7v-8h10v8z" />
    </svg>
  );
}
