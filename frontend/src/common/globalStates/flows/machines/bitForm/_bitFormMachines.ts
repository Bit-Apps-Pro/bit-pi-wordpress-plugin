import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import submitSuccess from './submitSuccess.bitForm.machine'

export default defineFlowMachineRoot({
  appSlug: 'bitForm',
  machines: [submitSuccess]
})
