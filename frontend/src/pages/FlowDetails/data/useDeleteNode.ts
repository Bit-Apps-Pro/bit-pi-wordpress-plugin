import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export default function useDeleteNode() {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['delete_flow'],
    mutationFn: async (nodeId: string) => request<string>(`node/${nodeId}/delete`)
  })

  return {
    deleteNode: mutateAsync,
    isNodeDeleting: isLoading
  }
}
