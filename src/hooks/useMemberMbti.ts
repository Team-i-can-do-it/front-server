import { useQuery } from '@tanstack/react-query';
import {
  getMemberMbti,
  type MemberMbtiDetail,
} from '@_api/MemberMbtiApiClient';

export function useMemberMbti() {
  return useQuery<MemberMbtiDetail | null>({
    queryKey: ['my-page', 'member-mbti'],
    queryFn: getMemberMbti,
    staleTime: 60 * 1000,
    retry: 1,
  });
}
