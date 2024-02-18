import type NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'

type ConditionType = {
  id?: string
  type: 'logic'
  leftExp: MappedValueType[] | []
  operator: string
  rightExp: MappedValueType[] | []
}

type LogicOperatorType = {
  id?: string
  type: 'logical-operator'
  value: string
}

type ConditionLoginType = {
  id: string
  title: string
  type: NodeTypeDef.conditionLogic
  condition: (ConditionType | LogicOperatorType)[]
}

type DefaultConditionLoginType = {
  id: string
  title: string
  type: NodeTypeDef.defaultConditionLogic
}

type ConditionTypes = ConditionLoginType | DefaultConditionLoginType

type ConditionalPropsType = {
  conditionId: string
  nodeId: string
}
