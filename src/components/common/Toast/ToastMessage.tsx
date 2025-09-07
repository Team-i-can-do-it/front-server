import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, // success
  faExclamation, // info
  faXmark, // error
} from '@fortawesome/free-solid-svg-icons';
import { useToastStore } from '@_store/toastStore';
import type { Toast } from '@_store/toastStore';

type Kind = NonNullable<Toast['type']>;

const ICONS: Record<Kind, any> = {
  success: faCheck,
  info: faExclamation,
  error: faXmark,
};

const BADGE_BG: Record<Kind, string> = {
  success: 'bg-status-positive',
  info: 'bg-status-danger',
  error: 'bg-red-500',
};

export default function ToastMessage({ id, message, type = 'info' }: Toast) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const t = setTimeout(() => removeToast(id), 3000);
    return () => clearTimeout(t);
  }, [id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="min-w-[172px] w-fit h-[52px] m-auto inline-flex items-center 
      gap-2 max-sm:gap-1 rounded-full p-4 max-sm:p-3  
      shadow-md shadow-gray-100/30
      bg-material-dimmed"
    >
      {/* 아이콘 */}
      <p
        className={`flex h-6 w-6 max-sm:h-7 max-sm:w-7 shrink-0 items-center justify-center rounded-full text-white ${BADGE_BG[type]}`}
      >
        <FontAwesomeIcon icon={ICONS[type]} size="sm" />
      </p>

      {/* 메시지 */}
      <p className="p-2 text-center typo-label3-m-14 text-white-base whitespace-nowrap">
        {message}
      </p>
    </motion.div>
  );
}
