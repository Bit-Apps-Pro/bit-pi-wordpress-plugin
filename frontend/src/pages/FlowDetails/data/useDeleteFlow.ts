import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

interface FlowDeletePayloadType {
  id: number
}

export default function useDeleteFlow() {
  const { mutate, data, isPending } = useMutation({
    mutationKey: ['delete_flow'],
    mutationFn: async (flowData: FlowDeletePayloadType) => request('flows/delete', flowData)
  })
  return { deleteFlowMutate: mutate, deleteFlowData: data, isDeleteFlowLoading: isPending }
}
