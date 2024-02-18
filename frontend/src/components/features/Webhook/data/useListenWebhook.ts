import request from '@common/helpers/request'
import { type ResponseType } from '@features/NodeDetailsModal/data/useVariables'
import { useMutation } from '@tanstack/react-query'

type WebhookInfoType = {
  flowId: number
  nodeId: string
}

export default function useListenWebhook(listenerType = 'CAPTURE') {
  const { mutateAsync } = useMutation({
    mutationKey: ['listen_webhook'],
    mutationFn: async ({ flowId, nodeId }: WebhookInfoType) =>
      request<ResponseType | ResponseType[]>(
        `hook-capture/${flowId}/${nodeId}`,
        null,
        { listener_type: listenerType },
        'GET'
      )
  })

  return {
    listenWebhook: mutateAsync
  }
}
