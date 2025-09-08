import ConfirmBar from '@_components/pageComponent/paragraph/ConfirmBar';
import EditorArea from '@_components/pageComponent/paragraph/EditorArea';
import MicPanel from '@_components/pageComponent/paragraph/MicPanel';
import SubmitBar from '@_components/pageComponent/paragraph/SubmitBar';
import ParagraphTopicBar from '@_components/pageComponent/paragraph/ParagraphTopicBar';
import { useCallback, useEffect, useState } from 'react';
import { useSTT } from '@_hooks/useSTT';
import { useParagraphFeedback, useParagraphSubmit } from '@_hooks/useParagraph';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@_hooks/useToast';

export default function ParagraphPage() {
  const [answer, setAnswer] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const trimmed = answer.trim();
  const isDisabled = trimmed.length === 0;
  const isLengthInvalid = trimmed.length < 10 || trimmed.length > 600;

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

  // 제출/피드백 뮤테이션
  const submitMutation = useParagraphSubmit();
  const feedbackMutation = useParagraphFeedback();

  useEffect(() => {
    if (isRecording) setAnswer(speechText);
  }, [speechText, isRecording]);

  const handleEditorChange = (v: string) => {
    setAnswer(v);
    setSpeechText(v);
  };

  // 제출 및 입력 x시 비활성화
  const handleSubmit = useCallback(async () => {
    if (isLengthInvalid) {
      toast('글쓰기는 100자 이상 600자 미만으로 작성해 주세요.', 'info');
      return;
    }
    if (isDisabled) return;

    try {
      console.log('제출:', trimmed);
      // 내용 제출
      const pcId = await submitMutation.mutateAsync(trimmed);

      // 피드백 요청
      await feedbackMutation.mutateAsync({ pcId, content: trimmed });

      stop();
      reset();
      setAnswer('');
      setConfirmOpen(false);
      setMicOpen(false);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      navigate(`/result/paragraph/${pcId}`);
    } catch (err) {
      console.error(err);
      toast('제출에 실패했어요. 잠시 후 다시 시도해 주세요.', 'info');
    }
  }, [
    isDisabled,
    isLengthInvalid,
    trimmed,
    stop,
    reset,
    toast,
    navigate,
    submitMutation,
    feedbackMutation,
  ]);

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
    <section>
      <div>
        <ParagraphTopicBar count={3} onChangeWords={() => {}} />
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
            submitDisabled={isDisabled || isLengthInvalid}
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
