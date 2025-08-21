import React from 'react';
import { useNavigate } from 'react-router-dom';
import closeIcon from '../../assets/closeIcon.svg';

export default function CloseTo({ to = '/home' }: { to?: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="닫기"
      onClick={() => navigate(to, { replace: true })}
      className="p-2 rounded-lg hover:bg-gray-50 active:scale-95 transition"
    >
      <img src={closeIcon} alt="닫기 버튼" className="h-5 w-5" />
    </button>
  );
}
