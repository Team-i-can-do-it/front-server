import logo from '@_icons/logo/logo.svg';

export default function HomeTitle() {
  return (
    <div>
      <img src={logo} alt="e-eum-Logo" className="mb-4" />
      <h1 className="typo-h2-sb-22 mb-7">오늘은 어떤 문장을 만들어 볼까요?</h1>
      <p className="typo-h4-sb-16 mb-3">말하기 연습 시작하기</p>
    </div>
  );
}
