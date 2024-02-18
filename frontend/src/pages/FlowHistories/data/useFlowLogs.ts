import request from '@common/helpers/request'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'

export type Log = {
  id: number
  node_id: string
  message: string
  details: {
    duration: number
    data_size: number
  }
  input: Record<string, unknown>
  output: Record<string, unknown>
  status: string
  node: {
    app_slug: string
    machine_label: string
  }
}

type ResponseType = {
  id: number
  name: string
  status: boolean
  flow_id: number
  logs: Log[]
}

export default function useFlowLogs(historyId: number) {
  const { data, isLoading }: UseQueryResult<{ data: ResponseType }, Error> = useQuery({
    queryKey: ['history', historyId],
    queryFn: async () => request(`history/${historyId}`, null, null, 'GET'),
    enabled: !!historyId
  })

  return {
    logs: data?.data?.logs || [],
    isLoading
  }
}
