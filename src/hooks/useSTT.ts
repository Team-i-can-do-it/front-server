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
  // 마지막으로 처리한 result index 추적
  const lastProcessedIndexRef = useRef(-1);
  // 이미 처리한 final 결과들의 텍스트를 저장
  const processedFinalsRef = useRef<Set<string>>(new Set());

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
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      // 새로운 세션 시작 시 초기화
      lastProcessedIndexRef.current = -1;
      processedFinalsRef.current.clear();
    };

    recognition.onresult = (event: any) => {
      // resultIndex부터 시작하여 새로운 결과만 처리
      const startIndex = event.resultIndex || 0;

      let newCommitted = '';
      const interims: string[] = [];

      // 기존 committed 텍스트 유지
      let fullCommitted = committedRef.current;

      // startIndex부터 처리 (새로운 결과만)
      for (let i = startIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transScriptRaw = result?.[0]?.transcript;

        if (typeof transScriptRaw !== 'string') continue;

        const transScript = transScriptRaw.trim();
        if (!transScript) continue;

        if (result.isFinal) {
          // 중복 체크: 동일한 final 텍스트가 이미 처리되었는지 확인
          const finalKey = `${i}-${transScript}`;
          if (!processedFinalsRef.current.has(finalKey)) {
            processedFinalsRef.current.add(finalKey);
            newCommitted += transScript + ' ';
          }
        } else {
          // interim 결과는 항상 표시
          interims.push(transScript);
        }
      }

      // 새로운 final 텍스트가 있으면 추가
      if (newCommitted) {
        fullCommitted = (fullCommitted + ' ' + newCommitted).trim();
        committedRef.current = fullCommitted;
      }

      // 화면에 표시할 텍스트 구성
      const display = (
        fullCommitted + (interims.length ? ' ' + interims.join(' ') : '')
      ).trim();

      setSpeechText(display);
      lastProcessedIndexRef.current = event.results.length - 1;
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
      // 시작 전 초기화
      lastProcessedIndexRef.current = -1;
      processedFinalsRef.current.clear();
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
    lastProcessedIndexRef.current = -1;
    processedFinalsRef.current.clear();
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
