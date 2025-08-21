import RadarSVG, { type RadarItem } from '../../../components/charts/RadarSVG';

export default function AnalysisPanel() {
  const subs: RadarItem[] = [
    { k: '내용 충실성', v: 32 },
    { k: '표현력', v: 34 },
    { k: '완성도', v: 48 },
    { k: '주제 명료성', v: 80 },
    { k: '논리성', v: 32 },
  ];

  const sections = [
    {
      title: '주제 명료성',
      body:
        `주장("컴퓨터 없이 살래")은 명확했지만, 중간에 불필요한 반복이 많음.\n` +
        `예시(연락·SNS·사진)는 나열 수준이라, 논리적으로 결론에 힘을 실어주지 못함.\n` +
        `마지막 부분은 맥락 연결이 약함.`,
    },
    {
      title: '논리성',
      body:
        `핵심 주장과 예시 간 연결 고리가 부족함.\n` +
        `단락마다 "그래서 무엇을 말하고 싶은가?"를 한 줄로 정리하면 좋아짐.`,
    },
  ];

  return (
    <>
      <div className="mx-5 rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <RadarSVG items={subs} />
      </div>

      <div className="mx-5 mt-5 rounded-2xl bg-white p-2 divide-y divide-[#F2F3F5]">
        {sections.map((s, i) => (
          <div key={i} className="p-3">
            <p className="text-base font-semibold mb-1">{s.title}</p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#3a3a3a]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
