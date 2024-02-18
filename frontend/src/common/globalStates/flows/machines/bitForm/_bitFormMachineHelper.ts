import { type MachineUtilityType } from '@common/globalStates/flows/FlowMachineType'
import { type HelpersType } from '@common/helpers/defineFlowMachine'

import { getForms } from './_bitFormApiHelper'

// eslint-disable-next-line import/prefer-default-export
export const fetchForms = async ($: MachineUtilityType, helpers: HelpersType) => {
  const formList = $('form-id')
  formList.loading = true
  $.setNode()

  if (helpers.isSelectComponent(formList)) {
    const { data, status } = await getForms()

    if (status === 'success') {
      formList.options = data
    }
  }

  formList.loading = false
}
