import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@_store/authStore';

export default function OAuthLanding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    // ProtectedRoute와 동일한 키를 사용 (환경변수 우선)
    const TOKEN_KEY =
      (import.meta.env.VITE_ACCESS_TOKEN as string) || 'access_token';

    // 백엔드가 붙여주는 쿼리 키 지원 (accessToken | token 둘 다 허용)
    const accessToken =
      searchParams.get('accessToken') || searchParams.get('token');

    if (accessToken) {
      try {
        // 1) 로컬 저장 (키 통일 중요)
        localStorage.setItem(TOKEN_KEY, accessToken);

        // 2) axios 기본 Authorization 헤더 즉시 세팅
        //    (useAuthStore.setAuth가 ApiClient.defaults.headers.Authorization까지 잡아줌)
        setAuth(null, accessToken);
      } finally {
        // 3) 토큰쿼리 지우면서 홈으로
        navigate('/e-eum', { replace: true });
      }
      return;
    }

    // 혹시 잘못 들어온 경우 (code/state만 들어온 경우) → 환영 페이지로
    if (searchParams.get('code') && searchParams.get('state')) {
      // 이 경우는 백엔드가 받아야 정상 플로우 (콜백 URL 설정 확인 필요)
      navigate('/welcome', { replace: true });
      return;
    }

    // 기본 폴백
    navigate('/welcome', { replace: true });
  }, [navigate, searchParams, setAuth]);

  return <div>로그인 처리 중입니다...</div>;
}
