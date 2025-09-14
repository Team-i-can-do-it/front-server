import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function OAuthLanding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 accessToken만 추출합니다.
    const accessToken = searchParams.get('accessToken');

    // refreshToken은 이제 URL에 없으므로 확인하지 않습니다.
    if (accessToken) {
      console.log('로그인 성공! Access Token을 저장합니다.');
      localStorage.setItem('accessToken', accessToken);

      // refreshToken은 서버에 안전하게 보관되므로 프론트에서는 저장하지 않습니다.
      // 혹시 로컬 스토리지에 남아있을 수 있는 이전 refreshToken은 정리해주는 것이 좋습니다.
      localStorage.removeItem('refreshToken');

      // '/home' 이나 실제 홈페이지 경로로 수정하세요.
      // App.jsx 라우터 설정을 보니 '/e-eum'이 홈 페이지인 것 같습니다.
      navigate('/e-eum', { replace: true });
    } else {
      console.error('URL에서 Access Token을 찾을 수 없습니다.');
      navigate('/welcome', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 이 페이지는 한번만 실행되므로 의존성 배열을 비워둡니다.

  return <div>로그인 처리 중입니다...</div>;
}
