import { useState } from 'react';

export default function EditorArea() {
  const [answer, setAnswer] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };
  return (
    <div className="mt-13 px-6">
      <textarea
        placeholder="답변을 작성하거나 음성으로 대답해주세요."
        className="w-[325px] min-h-[180px] typo-body1-m-20 resize-none focus:outline-none"
        value={answer}
        onChange={handleChange}
      ></textarea>

      <div className="flex justify-start">
        <p className="typo-label2-r-14 text-gray-500">
          현재 글자수 {answer.length}자
        </p>
      </div>
    </div>
  );
}
