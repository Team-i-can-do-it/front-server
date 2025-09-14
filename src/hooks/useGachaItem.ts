import { useQuery } from '@tanstack/react-query';
import { getGachaItem, type GachaDetail } from '@_api/GachaApiClient';

export function useGachaItem(id?: string) {
  return useQuery<GachaDetail>({
    queryKey: ['point-shop', 'detail', id ?? ''],
    queryFn: () => getGachaItem(id as string),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });
}
