import { useState } from 'react';
import Step1 from '@_pageComponent/auth/signup/components/Step1';
import Step2 from '@_pageComponent/auth/signup/components/Step2';
import { type AuthRequest, SignUp } from '@_api/AuthApiClient';
import Step3 from '@_components/pageComponent/auth/signup/components/Step3';
import { useToast } from '@_hooks/useToast';

export default function SignUpPage() {
  const [step, setStep] = useState<'1' | '2' | '3'>('1');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [signUpData, setSignUpData] = useState<AuthRequest>({
    name: '',
    email: '',
    password: '',
  });

  const submitSignUp = async () => {
    try {
      setLoading(true);
      // 간단 유효성 (필요하면 isValidEmailBasic, isValidPassword도 추가)
      if (
        !signUpData.name.trim() ||
        !signUpData.email.trim() ||
        !signUpData.password
      ) {
        toast('입력값을 확인해 주세요.', 'error');
        return;
      }

      await SignUp({
        name: signUpData.name.trim(),
        email: signUpData.email.trim(),
        password: signUpData.password,
      });

      toast('회원가입이 완료되었습니다.', 'success');
      setStep('3');
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 409) {
        toast('이미 가입된 이메일입니다.', 'error');
      } else if (status === 400) {
        toast('입력값 형식을 확인해 주세요.', 'error');
      } else {
        toast('회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'error');
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {step === '1' ? (
        <Step1 setStep={setStep} />
      ) : step === '2' ? (
        <Step2
          signUpData={signUpData}
          setSignUpData={setSignUpData}
          setStep={setStep}
          submitSignUp={submitSignUp}
          loading={loading}
        />
      ) : (
        <Step3 name={signUpData.name} />
      )}
    </div>
  );
}
