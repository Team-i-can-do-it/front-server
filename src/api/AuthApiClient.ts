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

export const SocialCallback = async (provider: 'google' | 'naver') => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') ?? undefined;

  const redirect_uri = `${window.location.origin}/oauth/callback/${provider}`;

  const res = await ApiClient.get(`/oauth2/code/${provider}`, {
    params: { code, redirect_uri, state },
    withCredentials: true,
  });

  return parseAuthResponse(res);
};

export const GetMyProfile = async (): Promise<User> => {
  const res = await ApiClient.get('/auth/me');
  const body = res?.data?.result ?? res?.data ?? {};
  const raw = body?.user ?? body?.member ?? body;
  const merged = mergeUserFromBodyAndClaims(raw, null);
  return merged;
};
