import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import ApiClient from '@_api/ApiClient';
import { useAuthStore } from '@_store/authStore';
import { GetMyProfile } from '@_api/AuthApiClient';

function pickToken(search: string, hash: string) {
  const sp = new URLSearchParams(search);
  const hp = new URLSearchParams(hash?.startsWith('#') ? hash.slice(1) : hash);
  const keys = ['accessToken', 'access_token', 'token', 'jwt'];
  for (const k of keys) {
    const v = sp.get(k) || hp.get(k);
    if (v) return v;
  }
  return '';
}

export default function OAuthLanding() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const tokenKey =
        (import.meta.env.VITE_ACCESS_TOKEN as string) ?? 'access_token';

      // 1) URL에서 토큰들 시도
      const accessToken = pickToken(loc.search, loc.hash);
      const refreshToken =
        new URLSearchParams(loc.search).get('refreshToken') ??
        new URLSearchParams(
          loc.hash?.startsWith('#') ? loc.hash.slice(1) : '',
        ).get('refreshToken') ??
        '';

      if (accessToken) {
        // 저장 + 헤더 세팅
        localStorage.setItem(tokenKey, accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        ApiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        setAuth(null, accessToken);

        // (선택) 프로필 하이드레이션
        try {
          const me = await GetMyProfile();
          if (me) setAuth(me, accessToken);
        } catch {} // 실패해도 홈으로 진행

        // URL 정리 후 홈으로
        window.history.replaceState({}, '', '/e-eum'); // 라우터에 /home 등록되어 있어야 함
        navigate('/e-eum', { replace: true });
        return;
      }

      // 2) 세션 쿠키 폴백: 서버가 쿠키로 로그인 유지하는 경우
      try {
        const me = await GetMyProfile();
        if (me) {
          setAuth(me, null);
          window.history.replaceState({}, '', '/e-eum');
          navigate('/e-eum', { replace: true });
          return;
        }
      } catch {}

      // 3) 진짜 토큰 없음
      const err = sp.get('error') || 'missing_token';
      navigate(`/signin?error=${encodeURIComponent(err)}`, { replace: true });
    })();
  }, []);

  return <div className="p-6">로그인 처리 중입니다…</div>;
}
