import request from '@common/helpers/request'
import { type UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export default function useFlowHistories(flowId: number, pageNumber: number, perPage: number) {
  const { data, isLoading, isFetching, refetch }: UseQueryResult<FlowHistoriesType, Error> = useQuery({
    queryKey: ['histories', [flowId, pageNumber, perPage]],
    queryFn: async () => request(`histories/${flowId}/${pageNumber}/${perPage}`, null, null, 'GET'),
    enabled: !!flowId && !Number.isNaN(flowId)
  })

  return {
    histories: data?.data?.data || [],
    totalPages: data?.data?.pages || 0,
    totalItems: data?.data?.total || 0,
    currentPage: data?.data?.current_page || 0,
    perPage: data?.data?.per_page || 0,
    isLogLoading: isLoading,
    isLogFetching: isFetching,
    refetchLogs: refetch
  }
}
