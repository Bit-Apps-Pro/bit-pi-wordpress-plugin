import { $flowSetupModal } from '@common/globalStates'
import $flowNodes from '@common/globalStates/$flowNodes'
import request from '@common/helpers/request'
import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'

import { type ConnectionsType } from './ConnectionQueryType'

export default function useConnections(appSlug?: AppsSlugType, machineSlug?: string) {
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const setFlowNodes = useSetAtom($flowNodes)

  const { data, isLoading, isFetching }: UseQueryResult<ConnectionsType, Error> = useQuery({
    queryKey: ['connections', appSlug || 'all'],
    queryFn: async () => request(`connections`, { appSlug }, null, 'POST'),
    enabled: !appSlug || (!!appSlug && !!machineSlug),
    onSuccess: res => {
      if (!res?.data || !machineSlug) return

      setFlowNodes(prev =>
        create(prev, draft => {
          const node = draft[nodeId]
          if (node?.states) {
            node.states.connections = res.data
          }
        })
      )
    }
  })

  return {
    connections: data?.data || [],
    isConnectionLoading: isLoading,
    isConnectionFetching: isFetching
  }
}
