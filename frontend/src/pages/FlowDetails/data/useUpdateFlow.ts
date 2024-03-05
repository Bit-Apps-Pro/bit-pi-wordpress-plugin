import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export interface NewTagType {
  title: string
  slug: string
}
interface FlowType {
  tag?: {
    newTags: NewTagType[]
    oldTags: string
  }
  flow?: {
    title?: string
    is_active?: number
    map?: string
    data?: string
  }
  id: number
}

export default function useUpdateFlow() {
  const { mutateAsync, data, isPending } = useMutation({
    mutationKey: ['update_flow'],
    // TODO: Fix this type
    mutationFn: async (flowData: FlowType) => request<any>('flows/update', flowData) // eslint-disable-line @typescript-eslint/no-explicit-any
  })
  return { updateFlow: mutateAsync, updateFlowData: data?.data, isFlowUpdating: isPending }
}
