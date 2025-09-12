import { useQuery } from '@tanstack/react-query';
import ApiClient from '@_api/ApiClient';
export type MyResult = { name: string; score: number };

export function useMyResult() {
  return useQuery<MyResult>({
    queryKey: ['my-result'],
    queryFn: async () => {
      const { data } = await ApiClient.get('/results/me'); // 엔드포인트 맞게 수정
      return data;
    },
    staleTime: 60_000,
  });
}
