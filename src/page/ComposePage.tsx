import ConfirmBar from '@_components/pageComponent/compose/ConfirmBar';
import EditorArea from '@_components/pageComponent/compose/EditorArea';
import MicPanel from '@_components/pageComponent/compose/MicPanel';
import SubmitBar from '@_components/pageComponent/compose/SubmitBar';
import TopicBar from '@_components/pageComponent/compose/TopicBar';
import { useCallback, useState } from 'react';

export default function ComposePage() {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const trimmed = answer.trim();
  const isDisabled = trimmed.length === 0;

  const [count, setCount] = useState(3);
  const submitUiDisabled = count > 0;

  // 제출 및 입력 x시 비활성화
  const handleSubmit = useCallback(() => {
    if (isDisabled) return;

    try {
      console.log('제출:', trimmed);
      // TODO: API연동
    } finally {
      setAnswer('');
      setConfirmOpen(false);
      setIsRecording(false);

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isDisabled, trimmed]);

  return (
    <section className="flex flex-col">
      <div>
        <TopicBar />
        <EditorArea
          value={answer}
          onChange={setAnswer}
          highlight={{ lastSentence: 8 }}
          spinnerCount={count}
          setSpinnerCount={setCount}
        />
      </div>

      <div>
        {isRecording ? (
          <MicPanel
            onTextInput={() => setIsRecording(false)}
            value={answer}
            onSubmit={() => {}}
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
            onRecordClick={() => setIsRecording(true)}
            value={answer}
            onChange={setAnswer}
          />
        )}
      </div>
    </section>
  );
}
