import { useEffect, useRef, useState } from 'react';

export default function RecordingTime({
  isRecording,
}: {
  isRecording: boolean;
}) {
  const [sec, setSec] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  const display = `${mm}:${ss}`;

  useEffect(() => {
    // 시작 시 1초 단위 증가
    if (isRecording) {
      setSec(0);
      intervalRef.current = window.setInterval(
        () => setSec((s) => s + 1),
        1000,
      );
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording]);

  return (
    <p
      className="typo-body2-r-16 text-text-100"
      aria-live="polite" //페이지가 변경 될 때, 사용자에게 해당 변경 사항을 실시간으로 알려준다. 라는 속성
      aria-atomic="true"
    >
      {display}
    </p>
  );
}
