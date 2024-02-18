import $flowNodes, {
  $flowNodesFamily,
  type FlowNodeDataType,
  type FlowNodeType
} from '@common/globalStates/$flowNodes'
import $importedMachines from '@common/globalStates/flows/$importedMachines'
import ComponentName from '@common/globalStates/flows/ComponentNameType'
import {
  type ComponentType,
  type ConnectionComponentType,
  type EventDataType,
  type FlowMachineStatesType,
  type ImportedMachinesType,
  type InputComponentType,
  type MachineEventType,
  type MixInputComponentType,
  type RepeaterFieldComponentType,
  type SelectComponentType,
  type WebhookComponentType
} from '@common/globalStates/flows/FlowMachineType'
import { type EndpointType } from '@features/Connection/ConnectionType'
import { type ConnectionType } from '@features/Connection/data/ConnectionQueryType'
import { type RepeaterFieldValueType } from '@utilities/RepeaterField/RepeaterFieldType'
import { type Getter, type Setter, getDefaultStore } from 'jotai'
import { create } from 'mutative'

import { deepCopy } from './globalHelpers'
import request from './request'

export async function importMachine({ data }: { data: EventDataType }) {
  const { appSlug, nodeId } = data

  const store = getDefaultStore()
  const setAtomValue: Setter = store.set

  const machine = await import(`../globalStates/flows/machines/${appSlug}/_${appSlug}Machines.ts`).catch(
    () => false
  )

  if (!machine) return

  const { default: machineConfigs } = machine

  setAtomValue($importedMachines, (prev: ImportedMachinesType) =>
    create(prev, draft => {
      draft.set(nodeId, machineConfigs)
    })
  )
}

export async function dispatchMachineEvent({
  data,
  actionType
}: {
  data: EventDataType
  actionType: MachineEventType
}) {
  const {
    nodeId,
    componentId,
    componentIndex
  }: { nodeId: string; componentId?: string; componentIndex?: number } = data

  const store = getDefaultStore()
  const getAtomValue: Getter = store.get
  const setAtomValue: Setter = store.set

  const flowNodesDraft = getAtomValue($flowNodes)
  const flowNode = getAtomValue($flowNodesFamily(nodeId))

  const { actions, states } = flowNode
  if (!actions) {
    console.error(`Actions not found for Node ID: ${nodeId} machine`)
    return
  }
  if (!states) {
    console.error(`State not found for Node ID: ${nodeId} machine`)
    return
  }
  if (!actionType || (typeof actionType === 'string' && !actions[actionType])) {
    console.error(`Action type ${actionType} not found for Node ID: ${nodeId} machine`)
    return
  }

  const [nodeDraft, finalize] = create(flowNode)

  if (!nodeDraft || !nodeDraft.states) {
    console.error(`Node:${nodeId}, node or node-state not found`)
    return
  }
  const thisComponent = selectComponentByIndex(nodeDraft.states.components, componentIndex, componentId)

  const componentSelectorFunc = createComponentSelector(nodeDraft.states.components)
  const getConnection = createConnectionSelector(nodeDraft)

  const setNode = (flowNodeId = nodeId) => {
    setAtomValue($flowNodesFamily(flowNodeId), deepCopy(nodeDraft))
  }

  const $: any = componentSelectorFunc // eslint-disable-line @typescript-eslint/no-explicit-any
  $.this = thisComponent
  $.getConnection = getConnection
  $.getAtomValue = getAtomValue
  $.setAtomValue = setAtomValue
  $.setNode = setNode

  let actionFunction

  if (typeof actionType === 'function') {
    actionFunction = actionType
  }
  if (typeof actionType === 'string') {
    actionFunction = actions[actionType]
  }

  await actionFunction?.({
    $,
    data: deepCopy(data),
    flowNodesDraft,
    nodeDraft
  })

  setAtomValue($flowNodesFamily(nodeId), finalize())
}

/**
 * replace machines special key with value
 * @param endPoint EndpointType
 * @param newValue Record<string, any>
 * @returns T
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function replaceValue<T>(endPoint: EndpointType, newValue: Record<string, any>) {
  let newEndPoint = {}

  Object.entries(endPoint).forEach(([key, value]) => {
    if (typeof value === 'object') {
      newEndPoint = { ...endPoint, [key]: replaceValue(value, newValue) }
    }
    if (/(\$_.*_\$)/.test(value)) {
      const replaceKey = value.replace(/(\$_)|(_\$)/g, '')
      if (replaceKey in newValue) {
        newEndPoint = { ...endPoint, [key]: newValue[replaceKey] }
      }
    }
  })

  return newEndPoint as T
}

type KeyValueType = {
  key: string
  value: string | number | boolean | MappedValueType[]
}
type RepeaterStructureValueType = KeyValueType[]
type FieldMappingFieldType = {
  path?: string
  value: string | number | boolean | MappedValueType[] | RepeaterStructureValueType[]
}
type FieldMappingType = {
  configs: Record<string, FieldMappingFieldType>
  data: FieldMappingFieldType[]
  repeaters: Record<string, FieldMappingFieldType>
}

/**
 * create a field mapping structure for flow execution
 * @param components ComponentType[]
 * @returns fieldMapping FieldMappingType
 */
export function getFieldMapping(components?: ComponentType[]) {
  if (!components) return null

  const fieldMapping: FieldMappingType = {
    configs: {},
    data: [],
    repeaters: {}
  }

  components.forEach(component => {
    const data: FieldMappingFieldType = { value: component.value }

    if (component?.path) {
      data.path = component.path
    }

    if (component?.fieldType === 'config') {
      fieldMapping.configs[component.id] = data
    } else if (component.componentName === ComponentName.repeaterField) {
      data.value = getRepeaterStructuredValue(component.value)
      fieldMapping.repeaters[component.id] = data
    } else {
      fieldMapping.data.push(data)
    }
  })

  return fieldMapping
}

/**
 * create a generalized repeater field structure for flow execution
 * @param repeaterValue ValueType[]
 * @returns RepeaterStructureValueType[]
 */
function getRepeaterStructuredValue(
  repeaterValue: RepeaterFieldValueType[][] = []
): RepeaterStructureValueType[] {
  return repeaterValue.map(item =>
    item.map(field => ({
      key: field.name,
      value: field.value
    }))
  )
}

/**
 * get flow node data for flow execution
 * @param states FlowMachineStatesType
 * @returns FlowNodeDataType
 */
export function getFlowNodeData(states?: FlowMachineStatesType) {
  if (!states) return null
  const statesDraft = { ...states }
  delete statesDraft?.connections

  const data: FlowNodeDataType = statesDraft
  data.components = states?.components?.map(component => ({
    id: component.id,
    value: component.value,
    render: component.render
  }))

  return data
}

function createComponentSelector(componentsArr: ComponentType[]) {
  return function getComponent(componentId: string) {
    const comp = componentsArr.find(component => component.id === componentId)
    if (comp) return comp

    console.error(
      `Component ID: ${componentId}, not found by $('${componentId}') | 'createComponentSelector'`
    )
    return {} as ComponentType
  }
}

function createConnectionSelector(nodeDraft: FlowNodeType) {
  return async function getConnection(expireTimeKey: string) {
    const connectionComponent = nodeDraft?.states?.components?.find(
      component => component.componentName === ComponentName.connection
    ) as ConnectionComponentType

    const connectionId: number | undefined = connectionComponent?.value

    if (connectionId === undefined || connectionId === null) {
      return false
    }

    const connection = nodeDraft?.states?.connections?.find(item => item.id === connectionId)
    if (!connection) {
      console.error(`No Connection Found with ID: ${connectionId}`)
      return false
    }

    const isExpired = isTokenExpired(
      Number(connection.auth_details.generated_at),
      Number(connection.auth_details?.[expireTimeKey])
    )

    if (!isExpired) return connection

    // refresh expired token
    const newConnection = await regenerateToken(connectionId, nodeDraft.appSlug)

    if (!newConnection) return false

    return updateConnection(nodeDraft, connectionId, newConnection)
  }
}

function updateConnection(
  nodeDraft: FlowNodeType,
  connectionId: number,
  newConnection: ConnectionType['auth_details']
) {
  if (!nodeDraft?.states?.connections) return false

  const connectionIndex = nodeDraft.states.connections.findIndex(item => item.id === connectionId)

  if (connectionIndex === -1) {
    console.error(`No Connection Found with ID: ${connectionId}`)
    return false
  }

  const connection = nodeDraft.states.connections[connectionIndex]
  connection.auth_details = newConnection
  return connection
}

async function regenerateToken(connectionId: number, appSlug?: string) {
  const res = await request<ConnectionType['auth_details']>(
    'refresh-token',
    { connectionId, appSlug },
    null,
    'POST'
  )

  if (res?.status === 'success') {
    return res.data
  }
  return false
}

function isTokenExpired(generatedAt: number, tokenExpireIn: number) {
  const currentTime = new Date().getTime()
  const tokenDuration = tokenExpireIn * 1000

  let tokenGeneratedTime = generatedAt
  if (generatedAt.toString().length === 10) {
    tokenGeneratedTime *= 1000 // convert to milliseconds
  }

  const tokenExpireTime = tokenGeneratedTime + tokenDuration

  if (currentTime >= tokenExpireTime) {
    return true
  }
  return false
}

function selectComponentByIndex(
  componentArr: ComponentType[],
  componentIndex?: number,
  componentId?: string
) {
  if (componentId && componentIndex !== undefined) {
    const comp = componentArr[componentIndex]
    if (comp && comp.id !== componentId) {
      console.error(
        `'$.this' not found, Component ID: ${componentId}, not match with component index: ${componentIndex}`
      )
    }
    if (comp) return comp

    console.error(`Component ID: ${componentId}, not found by 'selectComponentByIndex'`)
  }

  return {} as ComponentType
}

type CompType = { componentName: ComponentName }

export function isInputComponent(component: CompType): component is InputComponentType {
  return component.componentName === ComponentName.input
}

export function isMixInputComponent(component: CompType): component is MixInputComponentType {
  return component.componentName === ComponentName.mixInput
}

export function isSelectComponent(component: CompType): component is SelectComponentType {
  return component.componentName === ComponentName.select
}

export function isConnectionComponent(component: CompType): component is ConnectionComponentType {
  return component.componentName === ComponentName.connection
}

export function isWebhookComponent(component: CompType): component is WebhookComponentType {
  return component.componentName === ComponentName.webhook
}

export function isRepeaterFieldComponent(component: CompType): component is RepeaterFieldComponentType {
  return component.componentName === ComponentName.repeaterField
}
