import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
  useQuery,
} from '@tanstack/react-query';
import {
  fetchDailyScores,
  fetchMonthlyAvg,
  fetchHistory,
  type HistoryListPage,
} from '@/api/ResultApiClient';

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
    queryKey: ['history', 'daily', type, year, month],
    queryFn: () => fetchDailyScores({ type, year, month }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHistoryInfinite(type: 'topic' | 'paragraph') {
  return useInfiniteQuery<
    HistoryListPage, // 한 페이지
    Error,
    InfiniteData<HistoryListPage, number>, // 무한 데이터
    QueryKey,
    number // pageParam
  >({
    queryKey: ['history', type] as const,
    initialPageParam: 0, // 0-based로 시작
    queryFn: ({ pageParam }) => fetchHistory(type, pageParam, 10),
    getNextPageParam: (last) =>
      last.last === false && typeof last.page === 'number'
        ? last.page + 1
        : undefined,
    staleTime: 60_000,
  });
}
