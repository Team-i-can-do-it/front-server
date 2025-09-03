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

  // [LOG] LIVE 폴링 토글 & 상태
  const liveEnabled =
    (typeof window !== 'undefined' && (window as any).__STT_LIVE__ === true) ||
    (typeof window !== 'undefined' && localStorage.getItem('stt:live') === '1');
  const liveTimerRef = useRef<number | null>(null);
  const lastLiveLoggedRef = useRef('');
  const speechTextRef = useRef(''); // 최신 표시 문자열 추적
  useEffect(() => {
    speechTextRef.current = speechText;
  }, [speechText]);

  useEffect(() => {
    // 브라우저 내장 API
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    // [LOG]
    console.log(
      '[STT] init: support =',
      !!SpeechRecognition,
      'UA =',
      navigator.userAgent,
    );

    if (!SpeechRecognition) {
      setIsSupported(false);
      // [LOG]
      console.log('[STT] not supported on this browser');
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = true; // 연속으로 인식
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // [LOG]
    console.log('[STT] config', {
      lang: recognition.lang,
      continuous: recognition.continuous,
      interimResults: recognition.interimResults,
      maxAlternatives: recognition.maxAlternatives,
    });

    recognition.onstart = () => {
      setIsRecording(true);
      // 새로운 세션 시작 시 초기화
      lastProcessedIndexRef.current = -1;
      processedFinalsRef.current.clear();
      // [LOG]
      console.log('[STT] onstart: reset indices & finals');

      // [LOG] LIVE 폴링 시작 (선택)
      if (liveEnabled) {
        // 150ms 간격으로 현재 표시 문자열을 계속 로그 (변할 때만)
        if (liveTimerRef.current) window.clearInterval(liveTimerRef.current);
        liveTimerRef.current = window.setInterval(() => {
          const cur = speechTextRef.current;
          if (cur !== lastLiveLoggedRef.current) {
            console.log('[STT][LIVE] display ->', cur);
            lastLiveLoggedRef.current = cur;
          }
        }, 150);
      }
    };

    recognition.onaudiostart = () => console.log('[STT] onaudiostart');
    recognition.onsoundstart = () => console.log('[STT] onsoundstart');
    recognition.onspeechstart = () => console.log('[STT] onspeechstart');
    recognition.onspeechend = () => console.log('[STT] onspeechend');
    recognition.onsoundend = () => console.log('[STT] onsoundend');
    recognition.onaudioend = () => console.log('[STT] onaudioend');
    recognition.onnomatch = (e: any) => console.log('[STT] onnomatch', e);

    recognition.onresult = (event: any) => {
      // resultIndex부터 시작하여 새로운 결과만 처리
      const startIndex = event.resultIndex || 0;

      let newCommitted = '';
      const interims: string[] = [];

      // 기존 committed 텍스트 유지
      let fullCommitted = committedRef.current;

      // [LOG]
      console.log('[STT] onresult:', {
        resultIndex: event.resultIndex,
        resultsLength: event.results.length,
        startIndex,
      });

      // startIndex부터 처리 (새로운 결과만)
      for (let i = startIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transScriptRaw = result?.[0]?.transcript;

        if (typeof transScriptRaw !== 'string') continue;

        const transScript = transScriptRaw.trim();
        if (!transScript) continue;

        // [LOG] interim도 매번 찍힘
        console.log('[STT] result item', {
          i,
          isFinal: result.isFinal,
          transcript: transScript,
          confidence: result?.[0]?.confidence,
        });

        if (result.isFinal) {
          // 중복 체크: 동일한 final 텍스트가 이미 처리되었는지 확인
          const finalKey = `${i}-${transScript}`;
          if (!processedFinalsRef.current.has(finalKey)) {
            processedFinalsRef.current.add(finalKey);
            newCommitted += transScript + ' ';
            // [LOG]
            console.log('[STT] final accepted', {
              i,
              finalKey,
              added: transScript,
            });
          } else {
            // [LOG]
            console.log('[STT] final skipped (dup)', { i, finalKey });
          }
        } else {
          // interim 결과는 항상 표시
          interims.push(transScript);
        }
      }

      // 새로운 final 텍스트가 있으면 추가
      if (newCommitted) {
        const before = fullCommitted;
        fullCommitted = (fullCommitted + ' ' + newCommitted).trim();
        committedRef.current = fullCommitted;
        // [LOG]
        console.log('[STT] commit', {
          before,
          added: newCommitted.trim(),
          after: fullCommitted,
        });
      }

      // 화면에 표시할 텍스트 구성
      const display = (
        fullCommitted + (interims.length ? ' ' + interims.join(' ') : '')
      ).trim();

      // [LOG] “입력되는 순간” interim 변화가 있으면 즉시 로그
      if (interims.length) {
        console.log('[STT] interim display', interims);
      }
      console.log('[STT] display ->', display);

      setSpeechText(display);
      lastProcessedIndexRef.current = event.results.length - 1;
      // [LOG]
      console.log('[STT] lastProcessedIndex =', lastProcessedIndexRef.current);
    };

    recognition.onerror = (e: any) => {
      console.error('[STT] onerror', e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      // [LOG]
      console.log('[STT] onend');
      // [LOG] LIVE 폴링 중지
      if (liveTimerRef.current) {
        window.clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
        // [LOG]
        console.log('[STT] cleanup: stop() called');
      } catch {}
      recognitionRef.current = null;
      // [LOG] LIVE 폴링 정리
      if (liveTimerRef.current) {
        window.clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
    };
  }, []);

  const start = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      // 시작 전 초기화
      lastProcessedIndexRef.current = -1;
      processedFinalsRef.current.clear();
      // [LOG]
      console.log('[STT] start()');
      r.start();
      setIsRecording(true);
    } catch (e) {
      console.error('[STT] start error', e);
    }
  }, []);

  const stop = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      // [LOG]
      console.log('[STT] stop()');
      r.stop();
      setIsRecording(false);
    } catch (e) {
      console.error('[STT] stop error', e);
    }
  }, []);

  const reset = useCallback(() => {
    committedRef.current = '';
    setSpeechText('');
    lastProcessedIndexRef.current = -1;
    processedFinalsRef.current.clear();
    // [LOG]
    console.log('[STT] reset(): committed cleared & indices reset');
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
