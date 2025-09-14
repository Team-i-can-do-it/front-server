import ApiClient from '@_api/ApiClient';
import {
  ALL_CODES,
  MBTI_NAMES,
  type MbtiCode,
} from '@_constants/mbti/imageMap';

export type MyMbtiNormalized = {
  owned: MbtiCode[];
  representative?: MbtiCode;
  latest?: MbtiCode;
};

type RawResponse = { status: number; message: string; result: any };

const NAME_TO_CODE: Record<string, MbtiCode> = Object.fromEntries(
  ALL_CODES.map((code) => [MBTI_NAMES[code].toLowerCase(), code]),
) as Record<string, MbtiCode>;

function toMbtiCode(v: unknown): MbtiCode | undefined {
  if (v == null) return;
  const raw = String(v).trim();
  const s = raw.toLowerCase();

  if (s.startsWith('mbti')) {
    const n = s.replace('mbti', '');
    const code = `mbti${Number(n)}` as MbtiCode;
    return (ALL_CODES as string[]).includes(code) ? code : undefined;
  }
  if (/^\d+$/.test(s)) {
    const code = `mbti${Number(s)}` as MbtiCode;
    return (ALL_CODES as string[]).includes(code) ? code : undefined;
  }
  return NAME_TO_CODE[s] || NAME_TO_CODE[raw];
}

export async function getMyMbti(): Promise<MyMbtiNormalized> {
  const res = await ApiClient.get<RawResponse>('/member/mypage/mbti');

  if (import.meta.env.DEV) {
    console.groupCollapsed('[API] GET /member/mypage/mbti');
    console.log('status:', res.status);
    console.log('data:', res.data);
    console.log('result(raw):', res.data?.result);
    console.groupEnd();
  }

  const raw = res.data?.result ?? {};

  const ownedRaw =
    (Array.isArray(raw.mbtiList) && raw.mbtiList) ||
    (Array.isArray(raw.owned) && raw.owned) ||
    (Array.isArray(raw.ownedCodes) && raw.ownedCodes) ||
    (Array.isArray(raw.list) && raw.list) ||
    (Array.isArray(raw.mbtis) && raw.mbtis) ||
    (Array.isArray(raw.items) && raw.items) ||
    [];

  let owned = (ownedRaw as any[])
    .map((v) => {
      if (typeof v === 'string' || typeof v === 'number') return toMbtiCode(v);
      return (
        toMbtiCode(v?.mbtiId) ||
        toMbtiCode(v?.mbtiName) ||
        toMbtiCode(v?.code) ||
        toMbtiCode(v?.mbti) ||
        toMbtiCode(v?.id) ||
        toMbtiCode(v?.name)
      );
    })
    .filter(Boolean) as MbtiCode[];

  const latest =
    toMbtiCode(raw.recentlyMbtiId) ||
    toMbtiCode(raw.recentlyMbtiName) ||
    toMbtiCode(raw.latest) ||
    toMbtiCode(raw.last) ||
    toMbtiCode(raw.recent);

  const representative =
    toMbtiCode(raw.representative) ||
    toMbtiCode(raw.repMbti) ||
    toMbtiCode(raw.main) ||
    toMbtiCode(raw.mainMbti) ||
    toMbtiCode(raw.current) ||
    toMbtiCode(raw.name) ||
    latest;

  const merged = new Set<MbtiCode>(owned);
  if (representative) merged.add(representative);
  if (latest) merged.add(latest);
  owned = Array.from(merged);

  return { owned, representative, latest };
}
