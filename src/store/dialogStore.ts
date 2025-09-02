import type { ReactNode } from 'react';
import { create } from 'zustand';

type ButtonLayout = 'single' | 'double' | 'doubleVioletCancel';

export interface ModalOptions {
  title: ReactNode;
  description?: ReactNode;
  tag?: { text: string };

  buttonLayout?: ButtonLayout;

  confirmText?: string;
  cancelText?: string;

  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalState {
  isOpen: boolean;
  modal?: ModalOptions;

  open: (opts: ModalOptions) => void;
  close: () => void;

  confirm: (opts: Omit<ModalOptions, 'buttonLayout'>) => void;
  alert: (
    opts: Omit<ModalOptions, 'buttonLayout' | 'cancelText' | 'onCancel'>,
  ) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modal: undefined,

  open: (opts) =>
    set({
      isOpen: true,
      modal: {
        buttonLayout: opts.buttonLayout ?? 'double',
        confirmText: opts.confirmText ?? '확인',
        cancelText: opts.cancelText ?? '취소',
        ...opts,
      },
    }),

  close: () => set({ isOpen: false, modal: undefined }),

  confirm: (opts) =>
    set({
      isOpen: true,
      modal: {
        buttonLayout: 'double',
        confirmText: opts.confirmText ?? '확인',
        cancelText: opts.cancelText ?? '취소',
        ...opts,
      },
    }),

  alert: (opts) =>
    set({
      isOpen: true,
      modal: {
        buttonLayout: 'single',
        confirmText: opts.confirmText ?? '확인',
        ...opts,
      },
    }),
}));
export default useModalStore;
