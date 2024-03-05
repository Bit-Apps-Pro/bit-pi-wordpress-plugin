import { $flowSetupModal } from '@common/globalStates'
import $flowNodes from '@common/globalStates/$flowNodes'
import request from '@common/helpers/request'
import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'

import { type ConnectionsType } from './ConnectionQueryType'

export default function useConnections(appSlug?: AppsSlugType, machineSlug?: string) {
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const setFlowNodes = useSetAtom($flowNodes)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['connections', appSlug || 'all'],
    queryFn: async () => {
      const res = await request<ConnectionsType>(`connections`, { appSlug }, null, 'POST')

      if (res?.data && machineSlug) {
        setFlowNodes(prev =>
          create(prev, draft => {
            const node = draft[nodeId]
            if (node?.states) {
              node.states.connections = res?.data
            }
          })
        )
      }

      return res
    },
    enabled: !appSlug || (!!appSlug && !!machineSlug)
  })

  return {
    connections: data?.data || [],
    isConnectionLoading: isLoading,
    isConnectionFetching: isFetching
  }
}
