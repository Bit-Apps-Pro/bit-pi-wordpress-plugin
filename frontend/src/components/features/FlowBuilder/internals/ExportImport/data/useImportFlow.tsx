import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useImportFlow(flowId: number) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['flow-import', flowId],
    mutationFn: async (formData: FormData) =>
      request<{ message: string }>(`flow-import/${flowId}`, formData),
    onSuccess: res => {
      if (res.status === 'success') {
        queryClient.invalidateQueries()
      }
    }
  })

  return {
    importFlow: mutateAsync,
    isImporting: isPending
  }
}
