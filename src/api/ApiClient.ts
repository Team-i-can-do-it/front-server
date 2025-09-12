import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@_store/authStore';

// 외않돼
const baseURL = import.meta.env.VITE_API_BASE_URL;

const ApiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// 요청 인터셉터
ApiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 401 → refresh 시도 → 재시도
ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        // 서버가 /auth/refresh에서 새 accessToken을 JSON으로 반환한다고 가정
        const { data } = await axios.post<{ accessToken: string; user?: any }>(
          '/api/auth/refresh',
          null,
          { withCredentials: true },
        );
        useAuthStore
          .getState()
          .setAuth(data.user ?? useAuthStore.getState().user, data.accessToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return ApiClient.request(original);
      } catch (e) {
        useAuthStore.getState().clear();
      }
    }
    return Promise.reject(error);
  },
);

export default ApiClient;
