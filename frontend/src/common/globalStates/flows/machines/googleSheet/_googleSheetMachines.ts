import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import addRow from './addRow.googleSheet.machine'

export default defineFlowMachineRoot({
  appSlug: 'googleSheet',
  machines: [addRow]
})
