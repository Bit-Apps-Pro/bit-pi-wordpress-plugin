import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

export default function useWebhooks(flowId?: number, appSlug?: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['webhooks', flowId || 'all', appSlug || 'all'],
    queryFn: async () => request<WebhookType[]>('webhooks', { flowId, appSlug }, null, 'POST')
  })

  return {
    webhooks: data?.data || [],
    isWebhookLoading: isLoading
  }
}
