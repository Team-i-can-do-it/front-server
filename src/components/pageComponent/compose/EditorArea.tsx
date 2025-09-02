type EditorAreaProps = {
  value: string;
  onChange: (v: string) => void;
};

export default function EditorArea({ value, onChange }: EditorAreaProps) {
  return (
    <div className="mt-13 px-6">
      <textarea
        placeholder="답변을 작성하거나 음성으로 대답해주세요."
        className="w-[325px] min-h-[180px] typo-body1-m-20 resize-none focus:outline-none"
        value={value}
        readOnly
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
}
