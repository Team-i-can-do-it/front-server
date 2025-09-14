import ConfirmBar from '@_components/pageComponent/compose/ConfirmBar';
import EditorArea from '@_components/pageComponent/compose/EditorArea';
import MicPanel from '@_components/pageComponent/compose/MicPanel';
import SubmitBar from '@_components/pageComponent/compose/SubmitBar';
import TopicBar from '@_components/pageComponent/compose/TopicBar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSTT } from '@_hooks/useSTT';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@_hooks/useToast';

import { useConfirmExitHandlers } from '@_hooks/useExitConfirm';
import Header from '@_components/layout/Header';
import LoadingPage from './LoadingPage';
import { createAnswer } from '@_api/Answers';
import { GetTopicCategory, type CategoryType } from '@_api/TopicApiClient';
import type { AxiosError } from 'axios';

export default function ComposePage() {
  const { id } = useParams(); // "/compose/topic/:id"
  const [topicId, setTopicId] = useState<number | null>(null);
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

  const [isLoading, setIsLoading] = useState(false);
  const submitUiDisabled = count > 0;

  const submittingRef = useRef(false);

  // categoryData
  // topic, title, descriptio
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

  useEffect(() => {
    if (!id) return;
    GetTopicCategory(id as CategoryType)
      .then((res) => {
        if (typeof res.result.topicId === 'number') {
          setTopicId(res.result.topicId);
        } else {
          console.error('topicId가 숫자가 아님:', res.result.topicId);
        }
      })
      .catch((err) => {
        console.error('토픽 불러오기 실패:', err);
      });
  }, [id]);

  // 제출 및 입력 x시 비활성화
  const handleSubmit = useCallback(async () => {
    if (isLengthInvalid) {
      toast('글쓰기는 100자 이상 600자 미만으로 작성해 주세요.', 'info');
      return;
    }
    if (isDisabled) return;
    if (topicId == null) {
      toast('주제를 불러오는 중이에요. 잠시 후 다시 시도해 주세요.', 'info');
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;

    setIsLoading(true);

    try {
      const res = await createAnswer({
        topicId: topicId as number,
        content: trimmed,
      });

      stop();
      reset();
      setAnswer('');
      setConfirmOpen(false);
      setMicOpen(false);

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      if (res.status === 201) {
        navigate(`/result?id=${res.result?.id}&tab=summary`, { replace: true });
      } else {
        console.warn('예상치 못한 응답', res);
      }
    } catch (err) {
      const e = err as AxiosError<any>;
      const res = e.response;

      console.error('[POST /writing ERR]');
      console.log('baseURL:', (res?.config as any)?.baseURL);
      console.log('url:', res?.config?.url);
      console.log('method:', (res?.config as any)?.method);

      console.log('status:', res?.status);
      console.log('resp data:', res?.data); // 서버 에러 메시지(핵심)
      console.log('req headers:', (res?.config as any)?.headers);
      console.log('resp headers:', res?.headers);
      console.groupEnd();

      console.error('글 저장 실패:', err);
      toast('글 저장에 실패하였습니다.', 'error');
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  }, [
    isLengthInvalid,
    isDisabled,
    topicId,
    trimmed,
    stop,
    reset,
    toast,
    navigate,
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
                onSubmit={handleSubmit}
              />
            ) : (
              <SubmitBar
                submitUiDisabled={submitUiDisabled}
                submitDisabled={isDisabled || isLengthInvalid}
                onConfirm={() => setConfirmOpen(true)}
                onInvalid={() =>
                  toast(
                    '글쓰기는 100자 이상 600자 미만으로 작성해 주세요.',
                    'info',
                  )
                }
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
