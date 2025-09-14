import type { MbtiCode } from './imageMap';

// 백엔드가 이름('말썽쟁이 치와와')을 줄 때 코드로 변환하기 위함
export const NAME_TO_CODE: Record<string, MbtiCode> = {
  '말썽쟁이 치와와': 'mbti1',
  '수다쟁이 푸들': 'mbti2',
  '똑똑한 치와와': 'mbti3',
  '논리왕 푸들': 'mbti4',
  '몽상하는 고양이': 'mbti5',
  '사색하는 고양이': 'mbti6',
  '도도한 고양이': 'mbti7',
  '현명한 고양이': 'mbti8',
};
