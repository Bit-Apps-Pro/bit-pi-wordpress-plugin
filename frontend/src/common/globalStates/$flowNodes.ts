import { type ReactNode } from 'react'

import request from '@common/helpers/request'
import { type ConditionTypes } from '@features/FlowBuilder/internals/ConditionItem/ConditionalType'
import { nodeData } from '@features/NodeDetailsModal/data/useSaveNode'
import { type Getter, type Setter, atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { castDraft, create } from 'mutative'

import { $flowDetails } from './$flowDetails'
import $flowSaving from './$flowSaving'
import { type FlowMachineType } from './flows/FlowMachineType'

export interface FlowNodeDataType {
  components?: { id: string; value?: any }[] // eslint-disable-line @typescript-eslint/no-explicit-any
  conditions?: ConditionTypes[]
}
export interface VariableType {
  dType: string
  label: string
  path: string
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
export interface FlowNodeType extends Partial<FlowMachineType> {
  appTitle?: string
  appIcon?: ReactNode
  appColor?: string
  machineLabel?: string
  variables?: VariableType[]
}
export type FlowNodesAtomType = Record<string, FlowNodeType>

type SetFlowNodeType = (value: FlowNodeType) => FlowNodeType

const $flowNodes = atom<FlowNodesAtomType>({})

export const $flowNodesFamily = atomFamily((nodeId: string) =>
  atom(
    (get: Getter) => get($flowNodes)[nodeId],
    async (get: Getter, set: Setter, value: FlowNodeType | SetFlowNodeType) => {
      const flowNode = get($flowNodes)[nodeId] || {}
      let updatedValue = typeof value === 'function' ? value(flowNode) : value

      // reset related data if app changed
      if (updatedValue.appSlug !== 'tools' && flowNode.appSlug !== updatedValue.appSlug) {
        updatedValue = create(updatedValue, draft => {
          draft.machineLabel = undefined
          draft.machineSlug = undefined
          draft.states = undefined
        })
      }

      set($flowNodes, prv =>
        create(prv, draft => {
          draft[nodeId] = castDraft(updatedValue)
        })
      )
    }
  )
)

interface FlowNodeValue extends FlowNodeType {
  nodeId: string
}

export const $flowDynamicNode = atom(null, async (get: Getter, set: Setter, value: FlowNodeValue) => {
  const { nodeId, ...rest } = value

  set($flowNodesFamily(nodeId), rest)

  // save node after drag and drop
  set($flowSaving, true)
  await request('node/save', nodeData(get($flowDetails).id, nodeId, get($flowNodesFamily(nodeId))))
  set($flowSaving, false)
})

export default $flowNodes
