import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  upsertMemberMbti,
  type MemberMbtiDetail,
} from '@_api/MemberMbtiApiClient';

export function useUpsertMemberMbti() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: MemberMbtiDetail) => upsertMemberMbti(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-page'] }); // /member/myPage
      qc.invalidateQueries({ queryKey: ['my-page', 'member-mbti'] }); // /member/mbti
      qc.invalidateQueries({ queryKey: ['my-mbti'] }); // /member/mypage/mbti
    },
  });
}
