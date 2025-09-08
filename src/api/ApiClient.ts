import axios, { type AxiosInstance } from 'axios';

const ApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_DEV_ROOT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// 요청 인터셉터
ApiClient.interceptors.request.use(
  (config) => {
    // TODO: 백엔드에서 토큰 정책이 결정되면 작업 필요
    // const token = token
    // if (token) {
    //   config.headers.Authorization = Bearer ${token}
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('인증되지 않았습니다. - 401 STATUS');

      // TODO: refreshToken API 나오면 적용
      return null;
    }
    return Promise.reject(error);
  },
);

export default ApiClient;
