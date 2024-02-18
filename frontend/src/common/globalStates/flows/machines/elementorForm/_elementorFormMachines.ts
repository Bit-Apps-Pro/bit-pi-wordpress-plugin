import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import formsNewRecord from './formsNewRecord.elementorForm.machine'

export default defineFlowMachineRoot({
  appSlug: 'elementorForm',
  machines: [formsNewRecord]
})
