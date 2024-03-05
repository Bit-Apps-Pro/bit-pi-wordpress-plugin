import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

type WebhookDetailsType = { webhook_id: number; flow_id: number }

export default function useUpdateWebhook() {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['updateWebhook'],
    mutationFn: async (webhookDetails: WebhookDetailsType) =>
      request<WebhookType>(
        `webhooks/${webhookDetails.webhook_id}/update`,
        { flow_id: webhookDetails.flow_id },
        null,
        'POST'
      )
  })

  return {
    updateWebhook: mutateAsync,
    isUpdatingWebhook: isPending
  }
}
