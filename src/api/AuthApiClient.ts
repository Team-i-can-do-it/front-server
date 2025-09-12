import ApiClient from './ApiClient';

export type AuthRequest = { name: string; email: string; password: string };
export type User = { id: number; name: string; email: string } | null;
export type SignInResult = {
  accessToken: string | null;
  user: User;
  expiresIn?: number | null;
};

// data(POST), params(GET) 차이
export const SignUp = async (data: AuthRequest): Promise<void> => {
  await ApiClient.post('/auth/join', data);
};

export const SignIn = async (
  data: Omit<AuthRequest, 'name'>,
): Promise<SignInResult> => {
  const res = await ApiClient.post('/auth/login', data);

  // axios는 헤더 키를 소문자로 노멀라이즈함
  const headers = res.headers ?? {};
  // 예: Authorization: Bearer <token> 또는 X-Access-Token: <token>
  const headerToken =
    (headers['authorization'] as string | undefined)?.replace(
      /^bearer\s+/i,
      '',
    ) ||
    (headers['x-access-token'] as string | undefined) ||
    null;

  // 바디에도 올 수 있음: { accessToken, user, expiresIn } 또는 result 랩핑
  const body = (res.data?.result ?? res.data) as any;
  const bodyToken = (body?.accessToken as string | undefined) ?? null;

  const accessToken = bodyToken ?? headerToken;

  const user =
    (body?.user as User) ??
    // 혹시 다른 키로 오는 경우 대비
    (body?.member as User) ??
    null;

  const expiresIn =
    Number(headers['x-access-token-expires-in'] ?? body?.expiresIn ?? 0) ||
    null;

  return { accessToken, user, expiresIn };
};
