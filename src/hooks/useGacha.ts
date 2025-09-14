import { useQuery } from '@tanstack/react-query';
import {
  getGacha,
  type GachaItem,
  type ItemGetType,
} from '@_api/GachaApiClient';

const isGachaItem = (x: any): x is GachaItem =>
  x != null &&
  typeof x === 'object' &&
  'id' in x &&
  'name' in x &&
  'point' in x &&
  'quantity' in x;

export function useGacha(itemGetType: ItemGetType) {
  return useQuery<GachaItem[]>({
    queryKey: ['point-shop', itemGetType],
    queryFn: () => getGacha(itemGetType),
    staleTime: 60_000,
    retry: 1,
    // ✅ null/형식 불량 아이템 제거
    select: (raw) => (Array.isArray(raw) ? raw.filter(isGachaItem) : []),
    // keepPreviousData: true,
  });
}
