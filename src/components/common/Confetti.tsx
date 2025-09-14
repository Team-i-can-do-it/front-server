import { useEffect } from 'react';
import confetti from 'canvas-confetti';

type ConfettiProps = {
  open: boolean;
  duration?: number; // 전체 분출 시간(ms)
  onClose?: () => void;
};

export default function FullscreenConfetti({
  open,
  duration = 4000,
  onClose,
}: ConfettiProps) {
  useEffect(() => {
    if (!open) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      onClose?.();
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.opacity = '1';
    canvas.style.transition = 'opacity 1500ms ease'; // 페이드 시간
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    const TICKS = 40; // 파티클 생존 프레임
    const FADE_MS = 1500;
    const endAt = performance.now() + duration;

    let raf = 0;
    let finished = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      canvas.style.opacity = '0';
      const t = setTimeout(() => {
        canvas.remove();
        onClose?.();
      }, FADE_MS);
      timers.push(t);
    };

    const tick = () => {
      const now = performance.now();
      const timeLeft = endAt - now;
      const progress = Math.max(0, timeLeft / duration);

      // 점점 줄어드는 분출
      myConfetti({
        particleCount: Math.max(1, Math.floor(24 * progress)),
        spread: 100 + 20 * progress,
        startVelocity: 10 + 20 * progress,
        gravity: 0.8,
        ticks: TICKS,
        origin: {
          x: Math.random() < 0.5 ? 0.2 : 0.8,
          y: Math.random() * 0.7 + 0.2,
        },
      });

      if (timeLeft > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        // 마지막 분출의 파티클이 사라질 때까지 기다린 뒤 페이드
        const wait = Math.ceil((TICKS / 30) * 3000); // 초당 60fps 가정
        const t = setTimeout(finish, wait);
        timers.push(t);
      }
    };

    raf = requestAnimationFrame(tick);

    // 언마운트/열림 취소 시에도 페이드 후 제거
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      finish();
    };
  }, [open, duration, onClose]);

  return null;
}
