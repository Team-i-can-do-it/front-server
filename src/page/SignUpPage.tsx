import { useState } from 'react';
import Step1 from '@_pageComponent/auth/signup/components/Step1';
import Step2 from '@_pageComponent/auth/signup/components/Step2';
import { SignUp, type SignUpRequest } from '@_api/AuthApiClient';
import Step3 from '@_components/pageComponent/auth/signup/components/Step3';

export default function SignUpPage() {
  const [step, setStep] = useState<'1' | '2' | '3'>('1');

  const [signUpData, setSignUpData] = useState<SignUpRequest>({
    name: '',
    email: '',
    password: '',
  });

  const onChangeSignUpData = (signUpData: SignUpRequest) => {
    setSignUpData((prev) => ({
      ...prev,
      signUpData,
    }));
  };

  const submitSignUp = async () => {
    const response = await SignUp(signUpData);

    // success

    setStep('3');
  };
  return (
    <div>
      {step === '1' ? (
        <Step1 setStep={setStep} onChangeSignUpData={onChangeSignUpData} />
      ) : step === '2' ? (
        <Step2
          signUpData={signUpData}
          setSignUpData={setSignUpData}
          setStep={setStep}
          submitSignUp={submitSignUp}
        />
      ) : (
        <Step3 name={signUpData.name} />
      )}
    </div>
  );
}
