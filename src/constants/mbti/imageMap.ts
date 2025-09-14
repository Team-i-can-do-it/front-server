import mbti1 from '@_images/mbti1.png';
import mbti2 from '@_images/mbti2.png';
import mbti3 from '@_images/mbti3.png';
import mbti4 from '@_images/mbti4.png';
import mbti5 from '@_images/mbti5.png';
import mbti6 from '@_images/mbti6.png';
import mbti7 from '@_images/mbti7.png';
import mbti8 from '@_images/mbti8.png';

export type MbtiCode =
  | 'mbti1'
  | 'mbti2'
  | 'mbti3'
  | 'mbti4'
  | 'mbti5'
  | 'mbti6'
  | 'mbti7'
  | 'mbti8';

export const MBTI_IMAGES: Record<MbtiCode, string> = {
  mbti1,
  mbti2,
  mbti3,
  mbti4,
  mbti5,
  mbti6,
  mbti7,
  mbti8,
} as const;

export const MBTI_NAMES: Record<MbtiCode, string> = {
  mbti1: '말썽쟁이 치와와',
  mbti2: '수다쟁이 푸들',
  mbti3: '똑똑한 치와와',
  mbti4: '논리왕 푸들',
  mbti5: '몽상하는 고양이',
  mbti6: '사색하는 고양이',
  mbti7: '도도한 고양이',
  mbti8: '현명한 고양이',
} as const;

export const ALL_CODES: MbtiCode[] = [
  'mbti1',
  'mbti2',
  'mbti3',
  'mbti4',
  'mbti5',
  'mbti6',
  'mbti7',
  'mbti8',
];
