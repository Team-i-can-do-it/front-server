import { useState } from 'react';
import VioletTag from '@_components/common/Tag';
import IconTop from '@_icons/common/icon-top.svg?react';

type Axis = {
  /** 왼쪽 라벨 (예: 감정형) */
  left: string;
  /** 오른쪽 라벨 (예: 논리형) */
  right: string;
  /** 0(완전 왼) ~ 1(완전 오른) */
  value: number;
};

type MbtiTagCardProps = {
  tags: string[];
  axes: Axis[];
  defaultOpen?: boolean;
};

export default function MbtiTagCard({
  tags,
  axes,
  defaultOpen = true,
}: MbtiTagCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-10">
      {/* 태그들 */}
      <div className="flex items-center justify-center px-2 gap-2 my-5">
        {tags.map((t) => (
          <VioletTag key={t} label={t} size="sm" />
        ))}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center justify-center w-10 h-10 rounded-full
                     text-text-400 hover:text-text-700 transition"
        >
          <IconTop className={`w-6 h-6 ${open ? 'rotate-0' : 'rotate-180'}`} />
          <span className="sr-only">그래프 {open ? '접기' : '펼치기'}</span>
        </button>
      </div>

      {/* 축별 그래프 */}
      <div
        className={[
          'mt-5 grid justify-items-center transition-[grid-template-rows,opacity,transform] duration-300 ease-out',
          open
            ? 'grid-rows-[1fr] opacity-100 translate-y-0'
            : 'grid-rows-[0fr] opacity-0 -translate-y-1',
        ].join(' ')}
        aria-hidden={!open}
      >
        <ul className="space-y-6 w-full max-w-72">
          {axes.map((a) => {
            const v = Math.max(0, Math.min(1, a.value)); // clamp
            const isRight = v >= 0.5;

            return (
              <li key={`${a.left}-${a.right}`}>
                {/* 그래프 */}
                <div className="relative h-[3px] rounded-full bg-violet-50">
                  {/* 가운데 기준선 */}
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 w-[1px] h-full bg-border-25" />
                  {/* 포지션 점 */}
                  <span
                    className="absolute -top-[4px] w-[11px] h-[11px] rounded-full bg-brand-violet-500
                       shadow-[0_0_0_3px_var(--color-brand-violet-100)]"
                    style={{ left: `calc(${v * 100}% - 7px)` }}
                    aria-hidden
                  />
                </div>

                {/* 라벨(아래로 이동) */}
                <div className="flex items-center justify-between mt-3 mb-[5px]">
                  <p
                    className={`typo-label4-m-12 ${
                      isRight ? 'text-text-500' : 'text-brand-violet-500'
                    }`}
                  >
                    {a.left}
                  </p>
                  <p
                    className={`typo-label4-m-12  ${
                      isRight ? 'text-brand-violet-500' : 'text-text-200'
                    }`}
                  >
                    {a.right}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
