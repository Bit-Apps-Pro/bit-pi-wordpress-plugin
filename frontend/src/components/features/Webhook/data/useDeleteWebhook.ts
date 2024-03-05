import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteWebhook() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['delete_webhook'],
    mutationFn: async (webhookId: number) => request<number>(`webhooks/${webhookId}/delete`),
    onSuccess: ({ data: webhookId }) => {
      queryClient.setQueryData(['webhooks', 'all', 'all'], (prev: WebhookResType) => {
        if (!prev) return prev
        return {
          ...prev,
          data: prev.data.filter(({ id }) => id !== webhookId)
        }
      })
    }
  })

  return {
    deleteWebhook: mutateAsync,
    isWebhookDeleting: isPending
  }
}
