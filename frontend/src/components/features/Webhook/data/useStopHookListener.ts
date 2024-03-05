import { useParams } from 'react-router-dom'

import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export default function useStopHookListener() {
  const flowId = Number(useParams()?.flowId)

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['stopHookListener'],
    mutationFn: async () => request<WebhookType>(`stop-hook-listener`, { flowId }, null, 'POST')
  })

  return {
    stopHookListener: mutateAsync,
    isStoppingListener: isPending
  }
}
