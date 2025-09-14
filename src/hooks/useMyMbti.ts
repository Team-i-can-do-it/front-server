import { useQuery } from '@tanstack/react-query';
import { getMyMbti, type MyMbtiNormalized } from '@_api/MbtiApiClient';

export function useMyMbti() {
  return useQuery<MyMbtiNormalized>({
    queryKey: ['my-mbti'],
    queryFn: getMyMbti,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}
