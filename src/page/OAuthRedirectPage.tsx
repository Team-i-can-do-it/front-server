import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocialCallback } from '@_api/AuthApiClient';
import { useAuthStore } from '@_store/authStore';

export default function OAuthRedirectPage() {
  const { provider } = useParams<{ provider: 'google' | 'naver' }>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (!provider) return;
    (async () => {
      try {
        const res = await SocialCallback(provider);
        if (res.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);
          setAuth(res.user, res.accessToken);
          navigate('/', { replace: true });
        } else {
          navigate('/welcome', { replace: true });
        }
      } catch (e) {
        console.error('OAuth 로그인 실패', e);
        navigate('/welcome', { replace: true });
      }
    })();
  }, [provider, navigate, setAuth]);

  return <main className="p-6">로그인 중입니다…</main>;
}
