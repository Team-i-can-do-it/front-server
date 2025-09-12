import { useQuery } from '@tanstack/react-query';
import { getMyPage } from '@_api/MemberApiClient';

export function useMyPage() {
  return useQuery({
    queryKey: ['myPage'],
    queryFn: getMyPage,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
