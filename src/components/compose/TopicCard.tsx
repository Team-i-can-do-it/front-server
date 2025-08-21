type Props = {
  title: React.ReactNode;
  desc?: string;
  onClick?: () => void;
};

export default function TopicCard({ title, desc, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-star gap-3 py-4 rounded-xl cursor-pointer bg-white active:scale-[0.99] transition"
    >
      <div className="w-12 h-12 rounded-xl bg-yellow-200 shrink-0" />
      <div className="text-left">
        <p className="text-base font-semibold text-[#242424]">{title}</p>
        {desc ? <p className="text-sm text-gray-400 mt-0.5">{desc}</p> : null}
      </div>
    </button>
  );
}
