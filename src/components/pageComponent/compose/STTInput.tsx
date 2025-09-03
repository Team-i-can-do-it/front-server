import { useEffect, useRef, useState } from 'react';

export default function STTInput() {
  const [speechText, setSpeechText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);

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

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }

      setSpeechText(finalText + interim);
    };

    recognition.onerror = (e: any) => {
      console.error('STT error', e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (_) {}
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      setSpeechText((t) => (t ? t.replace(/\n\[듣는 중\][\s\S]*$/, '') : ''));
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error('start error', e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      setSpeechText((t) => (t ? t.replace(/\n\[듣는 중\][\s\S]*$/, '') : ''));
    } catch (e) {
      console.error('stop error', e);
    }
  };
  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      {!isSupported && (
        <div className="text-sm text-red-600">
          이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome/Edge 권장, HTTPS
          필요)
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
          className={`px-4 py-2 rounded border text-sm ${
            isListening
              ? 'bg-red-100 border-red-300'
              : 'bg-green-100 border-green-300'
          }`}
        >
          {isListening ? '듣기 중지' : '듣기 시작'}
        </button>
        <button
          type="button"
          onClick={() => setSpeechText('')}
          className="px-3 py-2 rounded border text-sm"
        >
          초기화
        </button>
      </div>
      <input
        type="text"
        value={speechText}
        onChange={(e) => setSpeechText(e.target.value)}
        placeholder={
          isSupported ? '마이크를 허용하고 말씀해 보세요…' : '지원되지 않음'
        }
        className="w-full h-10 p-3 border rounded text-sm bg-white text-black"
      />
    </div>
  );
}
