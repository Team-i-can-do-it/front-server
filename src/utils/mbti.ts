export type Expression = '감정형' | '논리형';
export type Content = '스토리텔링형' | '정보형';
export type Tone = '차분형' | '활발형';

export type Traits = { expression: Expression; content: Content; tone: Tone };

export type Persona = {
  code:
    | 'mbti1'
    | 'mbti2'
    | 'mbti3'
    | 'mbti4'
    | 'mbti5'
    | 'mbti6'
    | 'mbti7'
    | 'mbti8';
  title: string; // 캐릭터 이름 (ex. 똑똑한 치와와)
  groupTitle: string; // 상단 그룹 (ex. 강아지 / 고양이)
  animal: 'dog' | 'cat';
};

const MAP: Record<string, Persona> = {
  // 활발형(강아지)
  '활발형-감정형-정보형': {
    code: 'mbti1',
    title: '말썽쟁이 치와와',
    groupTitle: '강아지',
    animal: 'dog',
  },
  '활발형-감정형-스토리텔링형': {
    code: 'mbti2',
    title: '수다쟁이 푸들',
    groupTitle: '강아지',
    animal: 'dog',
  },
  '활발형-논리형-정보형': {
    code: 'mbti3',
    title: '똑똑한 치와와',
    groupTitle: '강아지',
    animal: 'dog',
  },
  '활발형-논리형-스토리텔링형': {
    code: 'mbti4',
    title: '논리왕 푸들',
    groupTitle: '`강아지',
    animal: 'dog',
  },

  // 차분형(고양이)
  '차분형-감정형-스토리텔링형': {
    code: 'mbti5',
    title: '몽상하는 고양이',
    groupTitle: '고양이',
    animal: 'cat',
  },
  '차분형-감정형-정보형': {
    code: 'mbti6',
    title: '사색하는 고양이',
    groupTitle: '고양이',
    animal: 'cat',
  },
  '차분형-논리형-정보형': {
    code: 'mbti7',
    title: '도도한 고양이',
    groupTitle: '고양이',
    animal: 'cat',
  },
  '차분형-논리형-스토리텔링형': {
    code: 'mbti8',
    title: '현명한 고양이',
    groupTitle: '고양이',
    animal: 'cat',
  },
};

export function pickPersona(traits: Traits): Persona {
  const key = `${traits.tone}-${traits.expression}-${traits.content}`;
  return (
    MAP[key] ?? {
      code: 'mbti1',
      title: '말썽쟁이 치와와',
      groupTitle: '`활발형` 강아지',
      animal: 'dog',
    }
  );
}

/** 0~1 값에서 좌/우 라벨 선택 */
export function chooseSide(
  value01: number,
  left: string,
  right: string,
): string {
  return value01 >= 0.5 ? right : left;
}
