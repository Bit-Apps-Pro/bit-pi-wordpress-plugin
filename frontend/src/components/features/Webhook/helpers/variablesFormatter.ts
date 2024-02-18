import { type VarType } from '@common/globalStates/flows/variables/FlowVariablesType'
import VarDataTypes from '@features/FlowVariables/VarDataTypes'
import { type ResponseVarsType } from '@features/NodeDetailsModal/data/useVariables'

export default function formatVariables(data: ResponseVarsType[], prevPath = '') {
  return data.map(item => {
    const newVar: VarType = {
      path: prevPath + item.key,
      label: item.key,
      dType: item.type,
      value: item.value
    }

    if (item.type === VarDataTypes.ARRAY || item.type === VarDataTypes.COLLECTION) {
      newVar.value = formatVariables(item.value, `${newVar.path}.`)
    }

    return newVar
  })
}
