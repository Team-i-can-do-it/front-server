import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useModalStore from '@_store/dialogStore';

// 이걸 쓴 이유는 ParagraphPage 와 ComposePage 에서 둘 다 쓰이기 때문에  훅으로 핸들러를 하나로 묶은 것,
export function useConfirmExitHandlers(when: boolean) {
  const navigate = useNavigate();
  const { open, close } = useModalStore();

  const confirmExit = (go: () => void) => {
    if (!when) {
      go();
      return;
    }
    open({
      title: '정말 나가시겠어요?',
      description: (
        <span className="block w-full text-left whitespace-pre-line">
          지금까지 연습했던 내용은 저장되지 않아요.{'\n'}
          내용을 모두 지우고 나가시겠어요?
        </span>
      ),
      buttonLayout: 'doubleRedCancel',
      cancelText: '이어하기',
      confirmText: '종료하기',
      onCancel: close,
      onConfirm: () => {
        close();
        go();
      },
    });
  };

  const onBack = () => {
    const idx =
      (window.history.state && (window.history.state as any).idx) ?? 0;
    confirmExit(() => {
      idx > 0 ? navigate(-1) : navigate('/e-eum', { replace: true });
    });
  };

  const onClose = () =>
    confirmExit(() => navigate('/e-eum', { replace: true }));

  return useMemo(() => ({ onBack, onClose }), [when]);
}
