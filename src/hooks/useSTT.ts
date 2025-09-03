import { useCallback, useEffect, useRef, useState } from 'react';

export function useSTT() {
  const [speechText, setSpeechText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  const committedRef = useRef('');

  useEffect(() => {
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
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      let committed = committedRef.current;
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const alt0 = res && res[0];
        const transcript = alt0?.transcript ?? '';
        if (res.isFinal) {
          committed += transcript + '';
        } else {
          interim += transcript;
        }
      }

      committedRef.current = committed.trimEnd();
      const display = (
        committedRef.current + (interim ? ' ' + interim : '')
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
