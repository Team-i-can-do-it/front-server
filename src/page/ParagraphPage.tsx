import ConfirmBar from '@_components/pageComponent/paragraph/ConfirmBar';
import EditorArea from '@_components/pageComponent/paragraph/EditorArea';
import MicPanel from '@_components/pageComponent/paragraph/MicPanel';
import SubmitBar from '@_components/pageComponent/paragraph/SubmitBar';
import ParagraphTopicBar from '@_components/pageComponent/paragraph/ParagraphTopicBar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSTT } from '@_hooks/useSTT';
import { useParagraphSubmit } from '@_hooks/useParagraph';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@_hooks/useToast';
import { useConfirmExitHandlers } from '@_hooks/useExitConfirm';
import Header from '@_components/layout/Header';
import LoadingPage from './LoadingPage';

export default function ParagraphPage() {
  const [answer, setAnswer] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const trimmed = answer.trim();
  const isDisabled = trimmed.length === 0;
  const isLengthInvalid = trimmed.length < 100 || trimmed.length > 600;

  const isDirty = answer.trim().length > 0;
  const { onBack, onClose } = useConfirmExitHandlers(isDirty);

  const [count, setCount] = useState(3);
  const submitUiDisabled = count > 0;

  const [words, setWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const submittingRef = useRef(false);

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
  //const feedbackMutation = useParagraphFeedback();

  useEffect(() => {
    if (isRecording) setAnswer(speechText);
  }, [speechText, isRecording]);

  const handleEditorChange = (v: string) => {
    setAnswer(v);
    setSpeechText(v);
  };

  // 제출 및 입력 x시 비활성화
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    if (submittingRef.current) return; // 중복 클릭 방지
    // 단어 포함되어야 제출가능
    const missing = words.filter((w) => !trimmed.includes(w));
    if (missing.length > 0) {
      toast(`제시된 단어를 모두 사용해야 제출할 수 있어요.`, 'info');
      return;
    }
    console.log('[handleSubmit] submit payload =', {
      content: trimmed,
      words,
    });
    console.log(
      '[submit payload body]',
      JSON.stringify({
        content: trimmed,
        words,
      }),
    );

    if (isLengthInvalid) {
      toast('글쓰기는 100자 이상 600자 미만으로 작성해 주세요.', 'info');
      return;
    }
    if (isDisabled) return;

    try {
      submittingRef.current = true;

      // 1) 제출 (content + words)
      const pcId = await submitMutation.mutateAsync({
        content: trimmed,
        words, // ← TopicBar에서 받은 3개 단어
      });
      console.log('[handleSubmit] pcId =', pcId);

      // 피드백 요청
      //await feedbackMutation.mutateAsync({ pcId, content: trimmed });

      stop();
      reset();
      setAnswer('');
      setConfirmOpen(false);
      setMicOpen(false);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      navigate(`/result?id=${pcId}&type=paragraph&tab=summary`, {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      toast('제출에 실패했어요. 잠시 후 다시 시도해 주세요.', 'info');
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
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
      <Header showBack showClose onBack={onBack} onClose={onClose} />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div>
            <ParagraphTopicBar
              count={3}
              onChangeWords={(next) => setWords(next)}
            />
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
                onInvalid={() => {
                  isLengthInvalid;
                  toast(
                    '글쓰기는 100자 이상 600자 미만으로 작성해 주세요.',
                    'info',
                  );
                }}
                onRecordClick={openMicPanel}
                value={answer}
                onChange={handleEditorChange}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
}
