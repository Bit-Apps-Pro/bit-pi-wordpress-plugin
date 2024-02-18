import { type FlowNodeType, type FlowNodesAtomType } from '@common/globalStates/$flowNodes'
import type ComponentName from '@common/globalStates/flows/ComponentNameType'
import { type ConnectionPropsType } from '@features/Connection/ConnectionType'
import { type ConnectionType } from '@features/Connection/data/ConnectionQueryType'
import { type ConditionTypes } from '@features/FlowBuilder/internals/ConditionItem/ConditionalType'
import { type DelayType } from '@features/FlowBuilder/internals/nodeTypes/Delay/Delay'
import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { type InputPropsType } from '@utilities/Input/Input'
import { type MixInputType } from '@utilities/MixInput/ui/MixInput'
import { type RepeaterFieldPropsType } from '@utilities/RepeaterField/RepeaterFieldType'
import { type SelectPropsType } from '@utilities/Select/Select'
import { type Getter, type Setter } from 'jotai'

export interface RootFlowMachineStatesAtomType {
  integrationMachines: Map<string, FlowMachineStatesType>
}

export interface EventDataType {
  nodeId: string
  e?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface MachineUtilityType {
  (componentId: string): ComponentType
  this: ComponentType
  getConnection: (expireTimeKey?: string) => ConnectionType
  getAtomValue: Getter
  setAtomValue: Setter
  setNode: (nodeId?: string) => void
}

export interface DispatchEventParamsType {
  $: MachineUtilityType
  data: EventDataType
  actionType?: MachineEventType
  flowNodesDraft?: FlowNodesAtomType
  nodeDraft?: FlowNodeType
}

export type SetterAction = {
  actionType: MachineEventType
  data: EventDataType
}

export interface FlowMachineActionsType {
  [key: Uppercase<string>]: (params: DispatchEventParamsType) => void
}

export type FlowMachineActionsAtomType = Map<string, FlowMachineActionsType>
export type ImportedMachinesType = Map<string, FlowMachineRootType>
export type MachineEventType =
  | Uppercase<string>
  | ((params: DispatchEventParamsType) => void | Promise<void>)
interface BaseComponentType {
  id: string
  componentName: ComponentName
  fieldType?: 'config'
  label: string
  render: boolean
  loading?: boolean
  onRender?: MachineEventType
  path?: string
}

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

type OmitKeys =
  | keyof BaseComponentType
  | 'onChange'
  | 'appName'
  | 'appSlug'
  | 'onConnectionChange'
  | 'onConnectionAddChange'
  | 'onWebhookChange'

type OmitBase<T> = Omit<T, OmitKeys>

export interface SelectComponentType extends BaseComponentType, OmitBase<SelectPropsType> {
  componentName: ComponentName.select
  onChange: MachineEventType
  onRefetchClick?: MachineEventType
}

export interface InputComponentType extends BaseComponentType, OmitBase<InputPropsType> {
  componentName: ComponentName.input
  onChange: MachineEventType
}

export interface MixInputComponentType extends BaseComponentType, OmitBase<MixInputType> {
  componentName: ComponentName.mixInput
  onChange: MachineEventType
}
export interface ConnectionComponentType extends BaseComponentType, OmitBase<ConnectionPropsType> {
  componentName: ComponentName.connection
  onConnectionChange?: MachineEventType
  onConnectionAddChange?: MachineEventType
  appSlug?: AppsSlugType
  appName?: string
}

export interface RepeaterFieldComponentType extends BaseComponentType, OmitBase<RepeaterFieldPropsType> {
  componentName: ComponentName.repeaterField
  onChange: MachineEventType
}

export interface WebhookComponentType extends BaseComponentType, OmitBase<WebhookPropsType> {
  componentName: ComponentName.webhook
  onWebhookChange?: MachineEventType
  appSlug?: AppsSlugType
}

export interface HookListenerComponentType extends BaseComponentType {
  componentName: ComponentName.hookListener
  value?: unknown
}

export type ComponentType =
  | SelectComponentType
  | InputComponentType
  | MixInputComponentType
  | ConnectionComponentType
  | RepeaterFieldComponentType
  | WebhookComponentType
  | HookListenerComponentType

export interface FlowMachineStatesType {
  components: ComponentType[]
  connections?: ConnectionType[]
  conditions?: ConditionTypes[]
  delay?: DelayType
}

export interface FlowMachineType {
  appSlug: AppsSlugType
  runType: 'action' | 'trigger'
  triggerType: 'WEBHOOK' | 'WP_HOOK' | 'SCHEDULE'
  machineSlug: string
  label: string
  states: FlowMachineStatesType
  actions: FlowMachineActionsType
}

export interface FlowMachineRootType {
  appSlug: AppsSlugType
  machines: FlowMachineType[]
}

export interface SelectOptionsType {
  label: string
  value: string | number
}
