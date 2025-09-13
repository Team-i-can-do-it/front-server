import mbti1 from '@_characters/mbti1.json';
import mbti2 from '@_characters/mbti2.json';
import mbti3 from '@_characters/mbti3.json';
import mbti4 from '@_characters/mbti4.json';
import mbti5 from '@_characters/mbti5.json';
import mbti6 from '@_characters/mbti6.json';
import mbti7 from '@_characters/mbti7.json';
import mbti8 from '@_characters/mbti8.json';

export type MbtiCode =
  | 'mbti1'
  | 'mbti2'
  | 'mbti3'
  | 'mbti4'
  | 'mbti5'
  | 'mbti6'
  | 'mbti7'
  | 'mbti8';

export const MBTI_LOTTIES: Record<MbtiCode, object> = {
  mbti1,
  mbti2,
  mbti3,
  mbti4,
  mbti5,
  mbti6,
  mbti7,
  mbti8,
};
