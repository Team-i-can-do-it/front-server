import { useCallback, useEffect, useRef, useState } from 'react';

/** 브라우저 Web Speech API를 사용해 음성 -> 텍스트 (speech to text) 를 간단히 제공하는 훅입니다.
 * 내부적으로 SpeechRecognition 인스턴스 생성
 * 녹음 중, 공백이 있으면 초기화될 수 있기 때문에, isFinal === true 인 텍스트를 committedRef 에 누적
 * start() 로 녹음 시작 stop() 으로 중지 reset() 은 초기화
 *
 * 반환 값
 * isSupported: 브라우저 기능을 쓰는 것이기 때문에 브라우저에서 STT 지원 여부
 * isRecording: 녹음 중 여부
 * speechText : 화면 표시용
 *  */

export function useSTT() {
  const [speechText, setSpeechText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any | null>(null);

  // 녹음하다 침묵 순간이 와도 이전 텍스트 사라지지 않게 관리
  const committedRef = useRef('');

  useEffect(() => {
    // 브라우저 내장 API
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = true; // 연속으로 인식
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);

    recognition.maxAlternatives = 1;

    // 매 결과 이벤트마다 전체 results 스캔

    recognition.onresult = (event: any) => {
      let committed = '';
      const interims: string[] = [];

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transScriptRaw = result?.[0]?.transcript;
        if (typeof transScriptRaw !== 'string') continue;

        const transScript = transScriptRaw.trim();
        if (!transScript) continue;

        if (result.isFinal) committed += transScript + ' ';
        else interims.push(transScript);
      }

      committed = committed.trimEnd();
      committedRef.current = committed;

      const display = (
        committed + (interims.length ? ' ' + interims.join(' ') : '')
      ).trim();
      setSpeechText(display);
    };

    recognition.onerror = (e: any) => {
      console.error('STT error', e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.start();
      setIsRecording(true);
    } catch (e) {
      console.error('start error', e);
    }
  }, []);

  const stop = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
      setIsRecording(false);
    } catch (e) {
      console.error('stop error', e);
    }
  }, []);

  const reset = useCallback(() => {
    committedRef.current = '';
    setSpeechText('');
  }, []);

  return {
    isSupported,
    isRecording,
    speechText,
    setSpeechText,
    start,
    stop,
    reset,
  };
}
