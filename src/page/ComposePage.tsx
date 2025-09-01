import EditorArea from '@_components/pageComponent/compose/EditorArea';
import MicPanel from '@_components/pageComponent/compose/MicPanel';
import SubmitBar from '@_components/pageComponent/compose/SubmitBar';
import TopicBar from '@_components/pageComponent/compose/TopicBar';
import { useCallback, useState } from 'react';

export default function ComposePage() {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const trimmed = answer.trim();
  const isDisabled = trimmed.length === 0;

  // 제출 및 입력 x시 비활성화
  const handleSubmit = useCallback(() => {
    if (isDisabled) return;
    console.log('제출:', trimmed);
    // TODO: API연동
  }, [isDisabled, trimmed]);

  return (
    <section className="flex flex-col">
      <div>
        <TopicBar />
        <EditorArea onChange={setAnswer} />
      </div>

      <div>
        {isRecording ? (
          <MicPanel
            onTextInput={() => setIsRecording(false)}
            value={answer}
            onSubmit={() => {
              handleSubmit();
              setIsRecording(false);
            }}
          />
        ) : (
          <SubmitBar
            submitDisabled={isDisabled}
            onSubmit={handleSubmit}
            onRecordClick={() => setIsRecording(true)}
            value={answer}
            onChange={setAnswer}
          />
        )}
      </div>
    </section>
  );
}
