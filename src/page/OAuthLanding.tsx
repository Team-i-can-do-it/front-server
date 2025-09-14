import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@_store/authStore';
import ApiClient from '@_api/ApiClient';

function getParam(name: string, search: string, hash: string) {
  const sp = new URLSearchParams(search);
  const hp = new URLSearchParams(hash?.startsWith('#') ? hash.slice(1) : hash);
  return sp.get(name) || hp.get(name) || '';
}

export default function OAuthLanding() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [sp] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const tokenKey =
      (import.meta.env.VITE_ACCESS_TOKEN as string) ?? 'access_token';
    const token =
      getParam('accessToken', loc.search, loc.hash) ||
      getParam('token', loc.search, loc.hash);

    if (!token) {
      const err = sp.get('error') || 'missing_token';
      navigate(`/login?error=${encodeURIComponent(err)}`, { replace: true });
      return;
    }

    // 1) 토큰 저장
    localStorage.setItem(tokenKey, token);
    ApiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    setAuth(null, token);

    window.history.replaceState({}, '', '/e-eum');
    navigate('/e-eum', { replace: true });
  }, []);

  return <main className="p-6">로그인 처리 중…</main>;
}
