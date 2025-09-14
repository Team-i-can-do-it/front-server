import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@_store/authStore';
import { mergeUserFromBodyAndClaims, parseJwtClaims } from '@_utils/jwt';

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

// rehydrate 전에 요청이 나가더라도 토큰을 붙이기 위한 폴백
function getPersistedToken(): string | null {
  try {
    const raw = localStorage.getItem('auth'); // zustand persist 기본 키
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

// 1) 요청: 토큰 주입
ApiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken ?? getPersistedToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
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
      const { data } = await ApiClient.post(REFRESH_PATH, null, {
        withCredentials: true,
      });

      const body = data?.result ?? data ?? {};
      const newToken = body?.accessToken ?? null;

      // body에 user가 없거나 email만 있어도 토큰 클레임으로 보강
      const rawUser = body?.user ?? body?.member ?? body;
      const claims = newToken ? parseJwtClaims(newToken) : null;
      const mergedUser = mergeUserFromBodyAndClaims(
        rawUser ?? useAuthStore.getState().user,
        claims,
      );

      if (newToken) {
        useAuthStore.getState().setAuth(mergedUser, newToken);
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
