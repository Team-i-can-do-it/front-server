import ApiClient from './ApiClient';

// data(POST), params(GET) 차이
export const SignIn = async () => {
  const response = await ApiClient.request({
    method: 'POST',
    url: '',
    data: '',
  });

  return response;
};
