import {
  fetchDailyScores,
  fetchHistoryList,
  fetchMonthlyAvg,
  type HistoryListResponse,
} from '@_api/Result';
import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';

export function useMonthlyAvg(type: 'topic' | 'paragraph', year: number) {
  return useQuery({
    queryKey: ['history-monthly', type, year],
    queryFn: () => fetchMonthlyAvg({ type, year }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDailyScores(
  type: 'topic' | 'paragraph',
  year: number,
  month: number,
) {
  return useQuery({
    queryKey: ['history-daily', type, year, month],
    queryFn: () => fetchDailyScores({ type, year, month }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHistoryInfinite(type: 'topic' | 'paragraph') {
  return useInfiniteQuery<
    HistoryListResponse, // TQueryFnData = "페이지 한 장" 타입
    Error,
    InfiniteData<HistoryListResponse, string | null>, // TData = InfiniteData<페이지, 커서>
    QueryKey,
    string | null // TPageParam
  >({
    queryKey: ['history', type],
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      fetchHistoryList({ type, cursor: pageParam, limit: 10 }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
