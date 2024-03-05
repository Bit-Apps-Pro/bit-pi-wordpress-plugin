import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ConnectionsType } from './ConnectionQueryType'

export default function useDeleteConnection() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['delete_connection'],
    mutationFn: async (connectionId: number) => request<number>(`connections/${connectionId}/delete`),
    onSuccess: ({ data: connectionId }) => {
      queryClient.setQueryData(['connections', 'all'], (prev: { data: ConnectionsType }) => {
        if (!prev) return prev
        return {
          ...prev,
          data: prev.data.filter(({ id }) => id !== connectionId)
        }
      })
    }
  })

  return {
    deleteConnection: mutateAsync,
    isConnectionDeleting: isPending
  }
}
