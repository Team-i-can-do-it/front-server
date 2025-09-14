import { useLocation } from 'react-router-dom';
import OAuthLanding from './OAuthLanding';
import ProtectedRoute from '@_routes/ProtectedRoute';
import HomePage from '@_page/HomePage';

function hasOAuthParams(search: string, hash: string) {
  const sp = new URLSearchParams(search);
  const hp = new URLSearchParams(hash?.startsWith('#') ? hash.slice(1) : '');
  const keys = [
    'accessToken',
    'access_token',
    'token',
    'jwt',
    'refreshToken',
    'error',
    'code',
    'state',
  ];
  return keys.some((k) => sp.get(k) || hp.get(k));
}

export default function EumGate() {
  const { search, hash } = useLocation();
  // 쿼리/해시에 콜백 파라미터 있으면 콜백 처리, 없으면 홈
  return hasOAuthParams(search, hash) ? (
    <OAuthLanding />
  ) : (
    <ProtectedRoute element={<HomePage />} />
  );
}
