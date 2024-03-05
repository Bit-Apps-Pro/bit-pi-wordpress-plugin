// import { type DefaultResponse } from '@common/helpers/request'
import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

type ResponseType = {
  status: 'success' | 'error'
  code: 'SUCCESS' | 'ERROR'
  data: string
}

type FlowReExecuteType = {
  flowId: number
}

export default function useFlowReExecute() {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['flow_re_execute'],
    mutationFn: async ({ flowId }: FlowReExecuteType) =>
      request<ResponseType>(`flow/re-execute/${flowId}`, null, null, 'GET')
  })

  return {
    FlowReExecuteMute: mutateAsync,
    isReExecuteLoading: isPending
  }
}
