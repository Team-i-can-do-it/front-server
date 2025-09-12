import ApiClient from './ApiClient';

// 메일 전송
export const requestEmailCode = async (email: string): Promise<void> => {
  await ApiClient.post('/mail/code/request', { email });
};

// 코드 검증
export type VerifyEmailCodeResponse = {
  verified?: boolean;
  message?: string;
} | void;

export const verifyEmailCode = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const res = await ApiClient.post<VerifyEmailCodeResponse>(
    '/mail/code/verify',
    { email, code },
  );
  // 서버가 바디 없이 200만 주는 경우도 true 처리
  if (!res.data) return true;
  if (typeof res.data.verified === 'boolean') return res.data.verified;
  return true;
};
