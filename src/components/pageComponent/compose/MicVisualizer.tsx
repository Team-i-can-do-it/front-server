import { forwardRef } from 'react';

const MicVisualizer = forwardRef<HTMLCanvasElement>(function MicVisualizer(
  _,
  ref,
) {
  return (
    <div className="w-full max-w-[190px] h-20">
      <canvas ref={ref} className="w-full h-full" />
    </div>
  );
});

export default MicVisualizer;
