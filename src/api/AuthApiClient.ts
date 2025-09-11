import ApiClient from './ApiClient';

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

// data(POST), params(GET) 차이
export const SignUp = async (data: SignUpRequest) => {
  const response = await ApiClient.request({
    method: 'POST',
    url: '/auth/join',
    data,
  });

  return response;
};
