// src/hooks/useMicVisualizer.ts
// 웹 오디오 기반 마이크 파형 시각화 훅
// - isRecording이 true면 시작, false면 정지
// - canvasRef에 실시간 바 그래프를 그림
// - iOS 오디오 정책 대응(reusme), 언마운트 시 자원 정리

import { useCallback, useEffect, useRef } from 'react';

type ByteArrayParam = Parameters<AnalyserNode['getByteFrequencyData']>[0];

export type UseMicVisualizerOptions = {
  /** 파형 막대 두께(px) */
  barWidth?: number;
  /** 막대 간격(px) */
  barGap?: number;
  /** 파형 높이 보정(진폭 배율) */
  heightFactor?: number;
  /** 최소 막대 높이(px) */
  minBarHeight?: number;
  /** 업데이트 주기(ms) */
  intervalMs?: number;
  /** 시작/정지 콜백 */
  onStart?: () => void;
  onStop?: () => void;
  getStream?: () => Promise<MediaStream>;
};

export function useMicVisualizer(
  isRecording: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  opts: UseMicVisualizerOptions = {},
) {
  const {
    barWidth = 1,
    barGap = 2,
    heightFactor = 4,
    minBarHeight = 1,
    intervalMs = 100,
    onStart,
    onStop,
    getStream,
  } = opts;

  // 오디오/시각화 관련 레퍼런스
  const recorder = useRef<{
    media: MediaRecorder | null;
    audioContext: AudioContext | null;
    source: MediaStreamAudioSourceNode | null;
    analyser: AnalyserNode | null;
  }>({ media: null, audioContext: null, source: null, analyser: null });

  const streamRef = useRef<MediaStream | null>(null); // ★ 스트림 별도 보관
  const runningRef = useRef<boolean>(false); // ★ 중복 start 가드
  const unmountedRef = useRef<boolean>(false);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dataArrayRef = useRef<ByteArrayParam | null>(null);
  const frameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 바 그래프 데이터 저장
  const barsRef = useRef<number[]>([]);
  const totalWidthRef = useRef<number>(0);
  const countRef = useRef<number>(0);
  const paddingX = 4;

  // 캔버스 초기화
  const ensureCanvasContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    // 캔버스 픽셀 사이즈를 실제 렌더 크기에 맞춤
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctxRef.current = ctx;
    return true;
  }, [canvasRef]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    // 배경 흰색 (필요 시 테마 컬러로 교체 가능)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  const calcBarSlots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    totalWidthRef.current = canvas.width - paddingX * 2;
    countRef.current = Math.floor(
      (totalWidthRef.current + barGap) / (barWidth + barGap),
    );
  }, [barGap, barWidth, canvasRef]);

  const initBars = useCallback(() => {
    barsRef.current = [];
    const n = countRef.current;
    for (let i = 0; i < n; i++) {
      barsRef.current.push(minBarHeight);
    }
  }, [minBarHeight]);

  const drawBars = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    clearCanvas();

    const centerY = canvas.height / 2;
    //const total = totalWidthRef.current;
    const bars = barsRef.current;

    ctx.fillStyle = '#7D33FE'; // --color-brand-violet-500

    for (let i = 0; i < bars.length; i++) {
      const w = barWidth;
      const h = bars[i];
      const x = canvas.width - paddingX - i * (w + barGap) - w; // 오른쪽에서 왼쪽으로
      const y = centerY - h / 2;

      if (x + w < paddingX) break; // 왼쪽 패딩 밖이면 중단
      ctx.fillRect(x, y, w, h);
    }
  }, [barGap, barWidth, clearCanvas, canvasRef]);

  const tick = useCallback(() => {
    const analyser = recorder.current.analyser;
    const arr = dataArrayRef.current;
    const canvas = canvasRef.current;

    if (!analyser || !arr || !canvas) return;

    analyser.getByteFrequencyData(arr);

    // 평균 진폭으로 막대 높이 산출 (심플 & 안정적)
    const avg =
      (arr as Uint8Array).reduce((acc, v) => acc + v, 0) /
      (arr as Uint8Array).length;

    const amplitude = Math.max(
      (avg / 255) * (canvas.height / 2) * heightFactor,
      minBarHeight,
    );

    // 최신 값을 앞쪽에 푸시 (오른→왼 이동 효과)
    barsRef.current.unshift(amplitude);
    if (barsRef.current.length > countRef.current) barsRef.current.pop();

    drawBars();

    frameTimerRef.current = setTimeout(tick, intervalMs);
  }, [canvasRef, drawBars, heightFactor, intervalMs, minBarHeight]);

  const start = useCallback(async () => {
    if (runningRef.current || unmountedRef.current) return;
    runningRef.current = true;

    const stream =
      (await (async () => (getStream ? getStream() : null))()) ||
      (await navigator.mediaDevices.getUserMedia({ audio: true }));

    // isRecording이 꺼졌거나 언마운트된 사이에 도착한 경우 즉시 정리
    if (!runningRef.current || unmountedRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      runningRef.current = false;
      return;
    }
    streamRef.current = stream;

    // 2) 오디오 컨텍스트 & 소스/분석기
    const audioCtx = new window.AudioContext();
    if (audioCtx.state === 'suspended') {
      // iOS / 브라우저 제약 대응
      await audioCtx.resume();
    }
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    // 3) 버퍼 준비
    dataArrayRef.current = new Uint8Array(
      analyser.frequencyBinCount,
    ) as ByteArrayParam;
    source.connect(analyser);

    // 4) 기록
    recorder.current.audioContext = audioCtx;
    recorder.current.source = source;
    recorder.current.analyser = analyser;
    recorder.current.media = null;

    onStart?.();

    // 5) 시각화 루프 시작
    frameTimerRef.current && clearTimeout(frameTimerRef.current);
    tick();
  }, [getStream, onStart, tick]);

  const stop = useCallback(() => {
    // 루프 종료
    if (frameTimerRef.current) {
      clearTimeout(frameTimerRef.current);
      frameTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // 마이크 스트림 정리
    if (recorder.current.source?.mediaStream) {
      recorder.current.source.mediaStream.getTracks().forEach((t) => t.stop());
    }

    // 오디오 컨텍스트 종료
    recorder.current.audioContext?.close().catch(() => {});

    // 레퍼런스 리셋
    recorder.current.media = null;
    recorder.current.source = null;
    recorder.current.analyser = null;
    recorder.current.audioContext = null;
    dataArrayRef.current = null;

    onStop?.();

    // 캔버스 초기 상태로 리셋
    initBars();
    drawBars();
    runningRef.current = false;
  }, [drawBars, initBars, onStop]);

  // 사이즈/컨텍스트 초기화
  useEffect(() => {
    if (!ensureCanvasContext()) return;
    calcBarSlots();
    initBars();
    drawBars();

    // 리사이즈 대응
    const handleResize = () => {
      if (!ensureCanvasContext()) return;
      calcBarSlots();
      initBars();
      drawBars();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      unmountedRef.current = true;
      window.removeEventListener('resize', handleResize);
      stop();
    };
  }, []);

  // isRecording 변화에 따라 시작/정지
  useEffect(() => {
    if (!canvasRef.current) return;

    if (isRecording) {
      if (!ensureCanvasContext()) return;
      calcBarSlots();
      initBars();
      drawBars();

      start().catch(() => stop());
    } else {
      stop();
    }
  }, [
    isRecording,
    start,
    stop,
    canvasRef,
    ensureCanvasContext,
    calcBarSlots,
    initBars,
    drawBars,
  ]);

  return {
    /** 외부에서 수동 제어가 필요하면 사용 */
    start,
    stop,
  };
}
