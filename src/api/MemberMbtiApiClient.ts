import ApiClient from '@_api/ApiClient';

export type MemberMbtiDetail = {
  name: string;
  description: string;
  imageUrl: string;
};

type MemberMbtiResponse = {
  status: number;
  message: string;
  result: Partial<MemberMbtiDetail> | null;
};

// 절대 URL로 변환 (번들 경로 -> 절대경로)
function toAbsoluteUrl(u?: string) {
  if (!u) return '';
  try {
    return new URL(u).href;
  } catch {
    try {
      return new URL(u, window.location.origin).href;
    } catch {
      return u;
    }
  }
}

// 대표 MBTI 조회 (GET /member/mbti)
export async function getMemberMbti(): Promise<MemberMbtiDetail | null> {
  const res = await ApiClient.get<MemberMbtiResponse>('/member/mbti');

  if (import.meta.env.DEV) {
    console.groupCollapsed('[API] GET /member/mbti');
    console.log('status:', res.status);
    console.log('data:', res.data);
    console.log('headers:', res.headers);
    console.groupEnd();
  }

  const raw = res.data?.result ?? null;
  if (!raw) return null;

  return {
    name: raw.name ?? '',
    description: raw.description ?? '',
    imageUrl: toAbsoluteUrl(raw.imageUrl ?? ''),
  };
}

export async function upsertMemberMbti(payload: MemberMbtiDetail) {
  const params = {
    name: (payload.name ?? '').trim().slice(0, 50),
    description: (payload.description ?? '').trim().slice(0, 500),
    imageUrl: toAbsoluteUrl(payload.imageUrl ?? ''),
  };

  if (import.meta.env.DEV) {
    console.groupCollapsed('[API] POST /member/mbti (query params)');
    console.log('params:', params);
    console.groupEnd();
  }

  const res = await ApiClient.post('/member/mbti', null, {
    params,
    headers: { Accept: '*/*' },
  });

  if (import.meta.env.DEV) {
    console.groupCollapsed('[API] POST /member/mbti (response)');
    console.log('status:', res.status);
    console.log('data:', res.data);
    console.groupEnd();
  }

  return res.data;
}
