import { type MachineUtilityType } from '@common/globalStates/flows/FlowMachineType'
import { type HelpersType } from '@common/helpers/defineFlowMachine'

import { getForms } from './_fluentFormsApiHelper'

// eslint-disable-next-line import/prefer-default-export
export const fetchForms = async ($: MachineUtilityType, helpers: HelpersType) => {
  const formList = $('form-id')
  formList.loading = true
  $.setNode()

  if (helpers.isSelectComponent(formList)) {
    const { data, status } = await getForms()

    if (status === 'success') {
      formList.options = data
      formList.status = undefined
    } else if (status === 'error') {
      formList.status = status
      formList.invalidMessage = data as unknown as string
    }
  }

  formList.loading = false
}
