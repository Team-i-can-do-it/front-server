import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@_store/authStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_PATH = '/auth/refresh';

const ApiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// 1) 요청: 토큰 주입
ApiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2) 응답: 401 => refresh => 원요청 재시도
ApiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = (error.config || {}) as any;
    const status = error.response?.status;

    // 401이 아니면 통과
    if (status !== 401) return Promise.reject(error);

    // refresh 호출 자체이거나 이미 재시도면 중단(루프 방지)
    const isRefreshCall = original?.url?.toString().includes(REFRESH_PATH);
    if (original?._retry || isRefreshCall) {
      useAuthStore.getState().clear();
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      // 같은 인스턴스로 호출(정확한 baseURL/withCredentials 유지)
      const { data } = await ApiClient.post(REFRESH_PATH, null, {
        withCredentials: true,
      });

      const newToken = data?.result?.accessToken ?? data?.accessToken ?? null;
      const newUser = data?.result?.user ?? data?.user ?? null;

      if (newToken) {
        useAuthStore
          .getState()
          .setAuth(newUser ?? useAuthStore.getState().user, newToken);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
      }
      // 토큰이 없어도(쿠키 세션 기반) 한 번은 재시도
      return ApiClient.request(original);
    } catch (e) {
      useAuthStore.getState().clear();
      return Promise.reject(e);
    }
  },
);

export default ApiClient;
