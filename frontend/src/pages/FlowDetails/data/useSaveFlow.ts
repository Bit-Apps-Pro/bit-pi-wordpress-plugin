import { $flowDetails, type FlowType } from '@common/globalStates/$flowDetails'
import $navigate from '@common/globalStates/$navigate'
import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

export default function useSaveFlow() {
  const setNavigate = useSetAtom($navigate)
  const setFlowDetails = useSetAtom($flowDetails)

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['save_flow'],
    mutationFn: async (flowData: FlowType) => request<FlowType>('flows/save', flowData),
    onSuccess: saveFlow => {
      if (!saveFlow.data.id) return
      setFlowDetails(saveFlow.data)
      setNavigate(`/flows/details/${saveFlow.data.id}`)
    }
  })

  return {
    saveFlow: mutateAsync,
    isFlowSaving: isPending
  }
}
