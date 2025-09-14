import ApiClient from './ApiClient';
import { mergeUserFromBodyAndClaims, parseJwtClaims } from '@_utils/jwt';

export type AuthRequest = { name: string; email: string; password: string };
export type User = { id: number; name: string; email: string } | null;

export type SignInResult = {
  accessToken: string | null;
  user: User;
  expiresIn?: number | null;
};

function parseAuthResponse(res: any): SignInResult {
  const headers = res?.headers ?? {};
  const headerToken =
    (headers['authorization'] as string | undefined)?.replace(
      /^bearer\s+/i,
      '',
    ) ||
    (headers['x-access-token'] as string | undefined) ||
    null;

  const body = res?.data?.result ?? res?.data ?? {};
  const bodyToken: string | null = body?.accessToken ?? null;
  const accessToken = bodyToken ?? headerToken ?? null;

  const rawUserFromBody = body?.user ?? body?.member ?? body;
  const claims = accessToken ? parseJwtClaims(accessToken) : null;
  const merged = mergeUserFromBodyAndClaims(rawUserFromBody, claims);

  const expiresIn =
    Number(headers['x-access-token-expires-in'] ?? body?.expiresIn ?? 0) ||
    null;

  return { accessToken, user: merged, expiresIn };
}

// data(POST), params(GET) 차이
export const SignUp = async (data: AuthRequest): Promise<void> => {
  await ApiClient.post('/auth/join', data);
};

export const SignIn = async (
  data: Omit<AuthRequest, 'name'>,
): Promise<SignInResult> => {
  const res = await ApiClient.post('/auth/login', data);
  return parseAuthResponse(res);
};

export const GetMyProfile = async (): Promise<User> => {
  // 백엔드가 제공 중인 스펙:
  // GET /member/myPage -> { status, message, result: { name, point, mbtiId, mbtiName } }
  const res = await ApiClient.get('/member/myPage');
  const result = res?.data?.result ?? {};
  // 최소한의 유저 객체 구성 (이메일/ID는 JWT에서 병합 가능)
  const claims = (() => {
    try {
      const token = localStorage.getItem(
        (import.meta.env.VITE_ACCESS_TOKEN as string) ?? 'access_token',
      );
      return token ? parseJwtClaims(token) : null;
    } catch {
      return null;
    }
  })();

  const user: User = {
    id: Number(claims?.sub) || 0,
    name: result?.name || claims?.name || '',
    email: claims?.email || '',
  };
  return user;
};
