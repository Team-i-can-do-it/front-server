import { useState, useMemo } from 'react';
import IconCheck from '@_icons/common/icon-check.svg?react';
import { isValidEmailBasic, isValidPassword } from '@_utils/validation';
import type { AuthRequest } from '@_api/AuthApiClient';

type Step2Props = {
  setStep: React.Dispatch<React.SetStateAction<'1' | '2' | '3'>>;
  signUpData: AuthRequest;
  setSignUpData: React.Dispatch<React.SetStateAction<AuthRequest>>;
  submitSignUp: () => void;
};

export default function Step2({
  setStep,
  signUpData,
  setSignUpData,
  submitSignUp,
}: Step2Props) {
  // 에러
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 유효성
  const nameValid = signUpData.name.trim().length > 0;
  const emailValid = isValidEmailBasic(signUpData.email);
  const passwordValid = isValidPassword(signUpData.password);

  const canSubmit = useMemo(
    () => nameValid && emailValid && passwordValid,
    [nameValid, emailValid, passwordValid],
  );

  // 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;

    setSignUpData((prev: AuthRequest) => ({
      ...prev,
      email: v,
    }));

    setEmailError(
      v && !isValidEmailBasic(v) ? '올바른 이메일 형식을 입력해 주세요.' : '',
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSignUpData((prev: AuthRequest) => ({
      ...prev,
      password: v,
    }));

    setPasswordError(
      v && !isValidPassword(v)
        ? '비밀번호는 8자 이상이고 특수문자 1개 이상을 포함해야 해요.'
        : '',
    );
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
            <p className="typo-label2-r-14 text-700">아이디</p>
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <input
                value={signUpData.email}
                type="email"
                onChange={handleEmailChange}
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
          disabled={!canSubmit}
          onClick={() => {
            setStep('3');
            submitSignUp();
          }}
          className={[
            'w-full typo-button-b-16 py-3 rounded-xl cursor-pointer transition-colors duration-200 ease-out',
            canSubmit
              ? 'bg-brand-violet-500 text-white hover:bg-brand-violet-600'
              : 'bg-material-dimmed text-white opacity-50 cursor-not-allowed',
          ].join(' ')}
        >
          완료
        </button>
      </div>
    </main>
  );
}
