import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useModalStore from '@_store/dialogStore';
import { VioletTag } from '@_components/common/Tag';

// 프로젝트 공용 버튼 스타일 ([확인])
function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'w-full h-12 py-3 px-4 rounded-xl typo-button-b-16',
        'bg-brand-violet-500 text-white hover:bg-brand-violet-400 cursor-pointer',
        'active:scale-[0.99] transition-[transform,background-color] duration-200',
        props.className ?? '',
      ].join(' ')}
    />
  );
}
function GrayButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'w-full h-12 rounded-xl typo-button-b-16',
        'bg-gray-50 text-white-base hover:bg-gray-100 cursor-pointer',
        'active:scale-[0.99] transition-[transform,background-color] duration-200',
        props.className ?? '',
      ].join(' ')}
    />
  );
}
function VioletButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'w-full h-12 rounded-xl typo-button-b-16',
        'bg-brand-violet-50 text-brand-violet-500 hover:bg-brand-violet-100 cursor-pointer',
        'active:scale-[0.99] transition-[transform,background-color] duration-200',
        props.className ?? '',
      ].join(' ')}
    />
  );
}

export default function ModalProvider() {
  const { isOpen, modal, close } = useModalStore();

  if (!isOpen || !modal) return null;

  const layout = modal.buttonLayout ?? 'double';
  const isDouble = layout === 'double' || layout === 'doubleVioletCancel';

  // 버튼 묶음 렌더러
  const renderFooter = () => {
    switch (layout) {
      case 'single':
        return (
          <PrimaryButton
            onClick={() => {
              modal.onConfirm?.();
              close();
            }}
          >
            {modal.confirmText ?? '확인'}
          </PrimaryButton>
        );

      case 'doubleVioletCancel':
        return (
          <>
            <VioletButton
              onClick={() => {
                modal.onCancel?.();
                close();
              }}
            >
              {modal.cancelText ?? '취소'}
            </VioletButton>
            <PrimaryButton
              onClick={() => {
                modal.onConfirm?.();
                close();
              }}
            >
              {modal.confirmText ?? '확인'}
            </PrimaryButton>
          </>
        );

      case 'double':
      default:
        return (
          <>
            <GrayButton
              onClick={() => {
                modal.onCancel?.();
                close();
              }}
            >
              {modal.cancelText ?? '취소'}
            </GrayButton>
            <PrimaryButton
              onClick={() => {
                modal.onConfirm?.();
                close();
              }}
            >
              {modal.confirmText ?? '확인'}
            </PrimaryButton>
          </>
        );
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="min-w-[330px] max-w-[420px] bg-white rounded-[20px] shadow-xl p-6"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
        >
          {/* 헤더 */}
          <div className="text-center">
            <h3 className="typo-h2-sb-20 text-text-900">{modal.title}</h3>

            {(modal.tag || modal.description) && (
              <div className="mt-3 flex flex-col items-center gap-3">
                {modal.tag && <VioletTag label={modal.tag.text} />}
                {modal.description && (
                  <p className="typo-body2-r-16 text-gray-500 text-center whitespace-pre-line">
                    {modal.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className={isDouble ? 'mt-5 grid grid-cols-2 gap-3' : 'mt-5'}>
            {renderFooter()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
