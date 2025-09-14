import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const tokenKey =
    (import.meta.env.VITE_ACCESS_TOKEN as string) ?? 'access_token';

  const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;

    // 1) 직접 저장된 토큰(key: tokenKey)
    const direct = localStorage.getItem(tokenKey);
    if (direct) return direct;

    // 2) zustand persist로 저장된 경우(name: 'auth')
    const persisted = localStorage.getItem('auth');
    if (!persisted) return null;

    try {
      const parsed = JSON.parse(persisted);

      // 여러 저장 구조에 대응
      // - { accessToken: '...' }
      // - { state: { accessToken: '...' } }
      // - sometimes persist may wrap state as a JSON string
      if (parsed == null) return null;

      if (typeof parsed === 'string') {
        // double-serialized
        try {
          const inner = JSON.parse(parsed);
          if (inner?.accessToken) return inner.accessToken;
          if (inner?.state?.accessToken) return inner.state.accessToken;
        } catch (_e) {
          return null;
        }
      }

      if (parsed.accessToken && typeof parsed.accessToken === 'string')
        return parsed.accessToken;
      if (
        parsed.state?.accessToken &&
        typeof parsed.state.accessToken === 'string'
      )
        return parsed.state.accessToken;

      return null;
    } catch (e) {
      // parse 에러나 예기치 않은 구조
      return null;
    }
  };

  const isAuthenticated: boolean = !!getAccessToken();

  // 인증되지 않은 경우 "/"으로 리다이렉트
  return isAuthenticated ? element : <Navigate to="/welcome" />;
};

export default ProtectedRoute;
