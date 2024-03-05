import { useParams } from 'react-router-dom'

import $flowNodes from '@common/globalStates/$flowNodes'
import request from '@common/helpers/request'
import formatVariables from '@features/Webhook/helpers/variablesFormatter'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { create } from 'mutative'

export type ResponseVarsType = {
  key: string
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
  type: string
}

export type ResponseType = {
  node_id: string
  variables: ResponseVarsType[]
}

export default function useVariables() {
  const setFlowNodes = useSetAtom($flowNodes)
  const flowId = Number(useParams()?.flowId)

  const { isLoading, data } = useQuery({
    queryKey: ['flows_variables', flowId],
    queryFn: async () => {
      const res = await request<ResponseType[]>(`flows/${flowId}/variables`, null, null, 'GET')

      if (res.status === 'success') {
        res.data?.forEach(node => {
          setFlowNodes(prev =>
            create(prev, draft => {
              draft[node.node_id].variables = formatVariables(node?.variables || [])
            })
          )
        })
      }

      return res
    },
    enabled: !!flowId && !Number.isNaN(flowId)
  })

  return {
    variables: data?.data || [],
    isVariableLoading: isLoading
  }
}
