import { useEffect, Fragment } from 'react';

interface SpinnerProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}

export default function Spinner({ setCount, count }: SpinnerProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 0) {
          clearInterval(interval);
          return 1;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Fragment>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-center relative">
          <svg className="h-[158px] w-[158px] animate-spin" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="white"
              strokeWidth="1"
              className="stroke-brand-violet-50"
            />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="1"
              strokeDasharray="20 158"
              strokeLinecap="round"
              className="stroke-brand-violet-200"
            />
          </svg>
          <div className="absolute rounded-full w-[5.4125rem] h-[5.4125rem] bg-brand-violet-50 flex items-center justify-center">
            <span className="typo-event1-r-48 text-brand-violet-500">
              {count}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <h2 className="typo-h2-sb-20 text-brand-violet-200 animate-pulse">
            생각할 시간...
          </h2>
        </div>
      </section>
    </Fragment>
  );
}
