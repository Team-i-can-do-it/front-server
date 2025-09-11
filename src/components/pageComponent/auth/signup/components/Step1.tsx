import { useToast } from '@_hooks/useToast';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import IconCheck from '@_icons/common/icon-check.svg?react';
import type { AuthRequest } from '@_api/AuthApiClient';

interface Step1Props {
  setStep: React.Dispatch<React.SetStateAction<'1' | '2' | '3'>>;
  onChangeSignUpData: (request: AuthRequest) => void;
}

export default function Step1({ setStep }: Step1Props) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');

  const toast = useToast();
  const codeInputRef = useRef<HTMLInputElement>(null);

  // ===== Validation helpers =====
  const isValidEmailBasic = (v: string) => v.includes('@') && v.includes('.');
  const isValidCode = (v: string) => /^\d{6}$/.test(v);
  const isExpired = useMemo(
    () => isCodeSent && timeLeft <= 0,
    [isCodeSent, timeLeft],
  );

  // 타이머 감소 + 만료 시 코드 무효화
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  useEffect(() => {
    if (isExpired) {
      setIsCodeValid(false);
      setCodeError('인증코드가 만료되었습니다. 재인증 해주세요.');
    }
  }, [isExpired]);

  const handleSendCode = useCallback(() => {
    if (sending) return;
    setSending(true);

    if (!email) {
      toast('이메일을 입력해 주세요.', 'error');
      setSending(false);
      return;
    }
    if (!isValidEmailBasic(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      toast('올바른 이메일 형식이 아닙니다.', 'error');
      setSending(false);
      return;
    }

    // 성공 플로우
    toast('메일이 성공적으로 전송되었습니다.', 'success');
    // TODO: 서버 API 호출 (POST /auth/send-code)
    console.log('이메일:', email);

    setIsCodeSent(true);
    setTimeLeft(180); // 3분
    setIsCodeValid(false); // 새 전송 시 초기화
    setCode('');
    setCodeError('');
    // UX: 전송 직후 코드 입력창 포커스
    setTimeout(() => codeInputRef.current?.focus(), 50);

    // 재전송 디바운싱 (2초)
    setTimeout(() => setSending(false), 2000);
  }, [email, sending, toast]);

  // 이메일 입력
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      value && !isValidEmailBasic(value)
        ? '이메일에 @와 .이 포함되어야 해요.'
        : '',
    );
  };

  // 코드 입력 (즉시 검증)
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    setCode(value);

    if (isExpired) {
      setIsCodeValid(false);
      setCodeError('인증코드가 만료되었습니다. 재인증 해주세요.');
      return;
    }

    if (!value) {
      setIsCodeValid(false);
      setCodeError('');
      return;
    }

    if (!isValidCode(value)) {
      setIsCodeValid(false);
      setCodeError('올바른 코드를 입력해주세요.');
      return;
    }

    // TODO: 서버 검증 API와 연결 시 여기서 verify 호출
    setIsCodeValid(true);
    setCodeError('');
  };

  // mm:ss 포맷
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const canSend = !sending && !!email && !emailError;
  const canComplete = isCodeValid && !isExpired;

  return (
    <main className="mt-9">
      <div className="flex flex-col items-start gap-10 px-6">
        <div>
          <h1 className="typo-h2-sb-20 text-text-900">
            이메일 인증을 해주세요
          </h1>
        </div>

        {/* 아이디 입력 */}
        <div className="flex flex-col gap-9 w-full relative">
          <div className="flex flex-col gap-3">
            <p className="typo-label2-r-14 text-700">아이디</p>
            <div className="flex justify-between border-b-2 border-gray-100 pb-2">
              <input
                value={email}
                type="email"
                onChange={handleEmailChange}
                className="typo-body2-r-16 w-2/3 outline-none placeholder:text-text-100"
                placeholder="아이디 (이메일)"
              />
              <button
                onClick={handleSendCode}
                disabled={!canSend}
                className={[
                  'py-1 px-3 h-7 rounded-[9px] typo-label3-m-14 cursor-pointer transition-colors',
                  !canSend
                    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                    : isCodeSent
                    ? 'bg-icon-25 text-text-100 hover:bg-icon-50'
                    : 'bg-icon-500 text-white-base hover:bg-icon-100',
                ].join(' ')}
              >
                {isCodeSent ? '재인증 하기' : '인증코드 전송'}
              </button>
            </div>
            {/* 이메일 에러 */}
            {emailError && (
              <p className="text-status-danger typo-label4-m-12 mt-1">
                {emailError}
              </p>
            )}
            {/* 타이머 */}
            {isCodeSent && (
              <p className="typo-label4-m-12 mt-1">
                {timeLeft > 0 ? (
                  <span className="text-status-danger">
                    남은 시간: {formatTime(timeLeft)}
                  </span>
                ) : (
                  <span className="text-status-danger">
                    인증코드가 만료되었습니다. 재인증 해주세요.
                  </span>
                )}
              </p>
            )}
          </div>

          {/* 인증코드 */}
          {isCodeSent && (
            <div className="flex flex-col gap-2">
              <p className="typo-label2-r-14 text-700">인증코드</p>
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2">
                <input
                  ref={codeInputRef}
                  value={code}
                  onChange={handleCodeChange}
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  className="typo-body2-r-16 w-2/3 outline-none placeholder:text-text-100"
                  placeholder="6자리 숫자 코드를 입력하세요"
                />
                {isCodeValid && !isExpired && <IconCheck className="w-6 h-6" />}
              </div>
              {/* 코드 에러 */}
              {codeError && (
                <p className="text-status-danger typo-label4-m-12">
                  {codeError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 z-50 w-[min(100vw,var(--mobile-w))] px-6 pb-10 py-3 bg-white border-t border-border-25">
        <button
          disabled={!canComplete}
          className={[
            'w-full typo-button-b-16 py-3 rounded-xl cursor-pointer transition-colors duration-200 ease-out',
            canComplete
              ? 'bg-brand-violet-500 text-white hover:bg-brand-violet-600'
              : 'bg-material-dimmed text-white opacity-50 cursor-not-allowed',
          ].join(' ')}
          onClick={() => setStep('2')}
        >
          완료
        </button>
      </div>
    </main>
  );
}
