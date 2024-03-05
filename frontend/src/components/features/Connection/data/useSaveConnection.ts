import { $flowSetupModal } from '@common/globalStates'
import $flowNodes from '@common/globalStates/$flowNodes'
import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'

import { type ConnectionType } from './ConnectionQueryType'

export default function useSaveConnection() {
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const setFlowNodes = useSetAtom($flowNodes)

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['save_connection'],
    mutationFn: async (connectionDetails: object) =>
      request<ConnectionType>('connections/save', connectionDetails, null, 'POST'),
    onSuccess: res => {
      if (!res.data) return

      setFlowNodes(prv =>
        create(prv, draft => {
          const node = draft[nodeId]
          if (node?.states) {
            if (!node.states.connections) node.states.connections = []
            node.states.connections.push(res.data)
          }
        })
      )
    }
  })

  return {
    saveConnection: mutateAsync,
    isSavingConnection: isPending
  }
}
