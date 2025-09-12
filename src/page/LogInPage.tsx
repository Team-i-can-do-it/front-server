import { isValidEmailBasic, isValidPassword } from '@_utils/validation';
import { useMemo, useState } from 'react';
import IconCheck from '@_icons/common/icon-check.svg?react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@_hooks/useToast';
import { SignIn } from '@_api/AuthApiClient';
import { useAuthStore } from '@_store/authStore';

export default function LogInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  // 유효성
  const emailValid = isValidEmailBasic(email);
  const passwordValid = isValidPassword(password);

  const canSubmit = useMemo(
    () => emailValid && passwordValid,
    [emailValid, passwordValid],
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEmail(v);
    setEmailError(
      v && !isValidEmailBasic(v) ? '올바른 이메일 형식을 입력해 주세요.' : '',
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPassword(v);
    setPasswordError(
      v && !isValidPassword(v)
        ? '비밀번호는 8자 이상이고 특수문자 1개 이상을 포함해야 해요.'
        : '',
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      const { accessToken, user } = await SignIn({
        email: email.trim(),
        password,
      });

      // 토큰이 헤더에만 있어도 위에서 추출되어 들어옴
      useAuthStore.getState().setAuth(user ?? null, accessToken ?? null);

      toast('로그인이 성공적으로 완료되었습니다.', 'success');
      navigate('/e-eum');
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 400) {
        // 서버가 메시지 내려주면 그대로 노출
        toast(msg || '이메일 또는 비밀번호를 확인해 주세요.', 'error');
      } else if (status === 401) {
        toast('이메일 또는 비밀번호가 올바르지 않아요.', 'error');
      } else {
        toast('로그인에 실패하였습니다.', 'error');
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mt-9">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-start gap-10 px-6">
          <h1 className="typo-h2-sb-20 text-text-900">로그인</h1>

          <div className="flex flex-col gap-9 w-full relative">
            {/* 아이디(이메일) */}
            <div className="flex flex-col gap-3">
              <p className="typo-label2-r-14 text-700">아이디</p>
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
                <input
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  autoComplete="username"
                  className="typo-body2-r-16 w-2/3 outline-none placeholder:text-text-100"
                  placeholder="abc@gmail.com"
                />
                {emailValid && <IconCheck className="w-6 h-6" />}
              </div>
              {emailError && (
                <p className="text-status-danger typo-label4-m-12 mt-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-3">
              <p className="typo-label2-r-14 text-700">비밀번호</p>
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
                <input
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  autoComplete="current-password"
                  className="typo-body2-r-16 w-2/3 outline-none placeholder:text-text-100"
                  placeholder="8자 이상, 특수문자 포함"
                />
                {passwordValid && <IconCheck className="w-6 h-6" />}
              </div>
              {passwordError && (
                <p className="text-status-danger typo-label4-m-12 mt-1">
                  {passwordError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="fixed bottom-0 z-50 w-[min(100vw,var(--mobile-w))] px-6 pb-10 py-3 bg-white border-t border-border-25">
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              'w-full typo-button-b-16 py-3 rounded-xl cursor-pointer transition-colors duration-200 ease-out',
              canSubmit
                ? 'bg-brand-violet-500 text-white hover:bg-brand-violet-600'
                : 'bg-material-dimmed text-white opacity-50 cursor-not-allowed',
            ].join(' ')}
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </form>
    </main>
  );
}
