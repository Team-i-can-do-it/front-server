type MbtiBadge = {
  id: string;
  label: string;
  locked?: boolean;
};

export default function MyMBTI({ list = [] }: { list?: MbtiBadge[] }) {
  return (
    <section>
      <h2 className="typo-h4-sb-16 mb-3">내 mbti 컬렉션</h2>

      <ul className="grid grid-cols-4 gap-4">
        {list.map((b) => (
          <li key={b.id} className="flex flex-col items-center gap-2">
            <div
              className={[
                'size-14 rounded-full grid place-items-center',
                b.locked ? 'bg-bg-10 text-text-300' : 'bg-brand-yellow-100',
              ].join(' ')}
            >
              {b.locked ? '🔒' : '😊'}
            </div>
            <p
              className={[
                'typo-label3-m-14 text-center',
                b.locked ? 'text-text-300' : 'text-text-700',
              ].join(' ')}
            >
              {b.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
