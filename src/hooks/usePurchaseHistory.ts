import { useQuery } from '@tanstack/react-query';
import { getPurchaseHistory, type PurchaseHistory } from '@_api/GachaApiClient';

export function usePurchaseHistory() {
  return useQuery<PurchaseHistory[]>({
    queryKey: ['purchase-history'],
    queryFn: getPurchaseHistory,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
