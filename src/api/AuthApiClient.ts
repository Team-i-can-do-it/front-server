import ApiClient from './ApiClient';

export type AuthRequest = {
  name: string;
  email: string;
  password: string;
};

// data(POST), params(GET) 차이
export const SignUp = async (data: AuthRequest) => {
  const response = await ApiClient.request({
    method: 'POST',
    url: '/auth/join',
    data,
  });

  return response;
};

export const SignIn = async (data: Omit<AuthRequest, 'name'>) => {
  const response = await ApiClient.request({
    method: 'POST',
    url: '/auth/login',
    data,
  });

  return response;
};
