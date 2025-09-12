import ApiClient from './ApiClient';

export type AuthRequest = { name: string; email: string; password: string };
export type SignInResponse = {
  accessToken: string;
  user: { id: number; name: string; email: string };
};

// data(POST), params(GET) 차이
export const SignUp = async (data: AuthRequest): Promise<void> => {
  await ApiClient.post('/auth/join', data);
};

export const SignIn = async (data: Omit<AuthRequest, 'name'>) => {
  const response = await ApiClient.request({
    method: 'POST',
    url: '/auth/login',
    data,
  });

  return response?.data;
};
