/**
 * Mix input value structured type
 */

type StringType = {
  type: 'string'
  value: string
}
type CommonVariableType = {
  type: 'common-variable'
  label: string
  slug: string
  dType: string
}
type VariableType = {
  type: 'variable'
  nodeId: string
  label: string
  path: string
  dType: string
}
type FunctionType = {
  type: 'function'
  slug: string
  args: MappedValueType[] | []
}
type MappedValueType = StringType | CommonVariableType | VariableType | FunctionType
