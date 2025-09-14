import { useQuery } from '@tanstack/react-query';
import { getMyPoint, type MyPointResult } from '@_api/MyPointApiClient';

export function useMyPoint() {
  return useQuery<MyPointResult>({
    queryKey: ['my-page', 'point'],
    queryFn: getMyPoint,
    staleTime: 60 * 1000,
    retry: 1,
  });
}
