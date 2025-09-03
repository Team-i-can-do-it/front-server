import ConfirmBar from '@_components/pageComponent/compose/ConfirmBar';
import EditorArea from '@_components/pageComponent/compose/EditorArea';
import MicPanel from '@_components/pageComponent/compose/MicPanel';
import SubmitBar from '@_components/pageComponent/compose/SubmitBar';
import TopicBar from '@_components/pageComponent/compose/TopicBar';
import { useCallback, useEffect, useState } from 'react';
import { useSTT } from '@_hooks/useSTT';

export default function ComposePage() {
  const [answer, setAnswer] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [micOpen, setMicOpen] = useState(false);

  const trimmed = answer.trim();
  const isDisabled = trimmed.length === 0;

  const [count, setCount] = useState(3);
  const submitUiDisabled = count > 0;

  const {
    isSupported,
    isRecording,
    speechText,
    setSpeechText,
    start,
    stop,
    reset,
  } = useSTT();

  useEffect(() => {
    if (isRecording) setAnswer(speechText);
  }, [speechText, isRecording]);

  const handleEditorChange = (v: string) => {
    setAnswer(v);
    setSpeechText(v);
  };

  // 제출 및 입력 x시 비활성화
  const handleSubmit = useCallback(() => {
    if (isDisabled) return;

    try {
      console.log('제출:', trimmed);
      // TODO: API연동
    } finally {
      stop();
      reset();
      setAnswer('');
      setConfirmOpen(false);
      setMicOpen(false);

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isDisabled, trimmed, stop, reset]);

  const openMicPanel = () => {
    if (!isSupported) return console.log('이 브라우저는 STT 미지원');
    setMicOpen(true);
  };

  const closeMicPanelToKeyboard = () => {
    stop();
    setMicOpen(false);
  };

  const toggleRecording = () => {
    if (!isSupported) return;
    isRecording ? stop() : start();
  };

  return (
    <section className="flex flex-col">
      <div>
        <TopicBar />
        <EditorArea
          value={answer}
          onChange={handleEditorChange}
          highlight={{ lastSentence: 8 }}
          spinnerCount={count}
          setSpinnerCount={setCount}
        />
      </div>

      <div>
        {micOpen ? (
          <MicPanel
            onTextInput={closeMicPanelToKeyboard}
            value={answer}
            onSubmit={handleSubmit}
            isRecording={isRecording}
            onToggleRecording={toggleRecording}
          />
        ) : confirmOpen ? (
          <ConfirmBar
            value={answer}
            textCount={answer.length}
            onTextInput={() => setConfirmOpen(false)}
            onSubmit={() => {
              handleSubmit();
            }}
          />
        ) : (
          <SubmitBar
            submitUiDisabled={submitUiDisabled}
            submitDisabled={isDisabled}
            onConfirm={() => setConfirmOpen(true)}
            onRecordClick={openMicPanel}
            value={answer}
            onChange={handleEditorChange}
          />
        )}
      </div>
    </section>
  );
}
