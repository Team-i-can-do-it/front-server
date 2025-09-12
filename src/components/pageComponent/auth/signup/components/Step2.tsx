import { useState, useMemo, useEffect } from 'react';
import IconCheck from '@_icons/common/icon-check.svg?react';
import { isValidEmailBasic, isValidPassword } from '@_utils/validation';
import type { AuthRequest } from '@_api/AuthApiClient';

type Step2Props = {
  setStep: React.Dispatch<React.SetStateAction<'1' | '2' | '3'>>;
  signUpData: AuthRequest;
  setSignUpData: React.Dispatch<React.SetStateAction<AuthRequest>>;
  submitSignUp: () => Promise<void>;
  loading?: boolean;
};

export default function Step2({
  setStep,
  signUpData,
  setSignUpData,
  submitSignUp,
  loading = false,
}: Step2Props) {
  // 에러

  const [passwordError, setPasswordError] = useState('');

  // 유효성
  const nameValid = signUpData.name.trim().length > 0;
  const emailValid = isValidEmailBasic(signUpData.email);
  const passwordValid = isValidPassword(signUpData.password);

  // 이메일이 비어있거나 유효하지 않으면 Step1로 회귀 (직접 URL 진입 대비)
  useEffect(() => {
    if (!signUpData.email || !emailValid) {
      setStep('1');
    }
  }, [signUpData.email, emailValid, setStep]);

  const canSubmit = useMemo(
    () => nameValid && emailValid && passwordValid,
    [nameValid, emailValid, passwordValid],
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSignUpData((prev) => ({ ...prev, password: v }));
    setPasswordError(
      v && !isValidPassword(v)
        ? '비밀번호는 8자 이상이고 특수문자 1개 이상을 포함해야 해요.'
        : '',
    );
  };

  const handleComplete = async () => {
    if (!canSubmit || loading) return;
    await submitSignUp();
    setStep('3');
  };

  return (
    <main className="mt-9">
      <div className="flex flex-col items-start gap-10 px-6">
        <h1 className="typo-h2-sb-20 text-text-900">
          회원가입을 진행해 주세요
        </h1>

        <div className="flex flex-col gap-9 w-full relative">
          {/* 이름 */}
          <div className="flex flex-col gap-3">
            <p className="typo-label2-r-14 text-700">이름</p>
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <input
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData((prev: AuthRequest) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="typo-body2-r-16 w-2/3 outline-none placeholder:text-text-100"
                placeholder="성함을 입력해 주세요"
              />
              {nameValid && <IconCheck className="w-6 h-6" />}
            </div>
          </div>

          {/* 아이디(이메일) */}
          <div className="flex flex-col gap-3">
            <p className="typo-label2-r-14 text-700">아이디(이메일)</p>
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <input
                value={signUpData.email}
                readOnly
                className="typo-body2-r-16 w-2/3 outline-none text-text-500"
              />
              <span className="typo-label4-m-12 text-brand-violet-500">
                인증 완료
              </span>
            </div>
            <button
              type="button"
              className="self-end typo-label4-m-12 text-text-300 hover:underline mt-1 cursor-pointer"
              onClick={() => setStep('1')}
            >
              이메일 변경/재인증
            </button>
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-3">
            <p className="typo-label2-r-14 text-700">비밀번호</p>
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <input
                value={signUpData.password}
                type="password"
                onChange={handlePasswordChange}
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
          disabled={!canSubmit || loading}
          onClick={handleComplete}
          className={[
            'w-full typo-button-b-16 py-3 rounded-xl cursor-pointer transition-colors duration-200 ease-out',
            canSubmit
              ? 'bg-brand-violet-500 text-white hover:bg-brand-violet-600'
              : 'bg-material-dimmed text-white opacity-50 cursor-not-allowed',
          ].join(' ')}
        >
          {loading ? '가입 중...' : '완료'}
        </button>
      </div>
    </main>
  );
}
