import request from '@common/helpers/request'
import { type UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export default function useWebhooks(flowId?: number, appSlug?: string) {
  const { data, isLoading }: UseQueryResult<{ data: WebhooksType }, Error> = useQuery({
    queryKey: ['webhooks', flowId || 'all', appSlug || 'all'],
    queryFn: async () => request('webhooks', { flowId, appSlug }, null, 'POST')
  })

  return {
    webhooks: data?.data || [],
    isWebhookLoading: isLoading
  }
}
