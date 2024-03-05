import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useSaveWebhook(flowId?: number) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['saveWebhook'],
    mutationFn: async (webhookDetails: WebhookDetailsType & { flow_id: number }) =>
      request<WebhookType>('webhooks/save', webhookDetails, null, 'POST'),
    onSuccess: res => {
      if (!res.data) return

      queryClient.setQueryData(
        ['webhooks', flowId || 'all', res.data.app_slug || 'all'],
        (prev: WebhookResType) => {
          if (!prev) return prev

          return {
            ...prev,
            data: [...(prev.data || []), res.data]
          }
        }
      )
    }
  })

  return {
    saveWebhook: mutateAsync,
    isSavingWebhook: isPending
  }
}
