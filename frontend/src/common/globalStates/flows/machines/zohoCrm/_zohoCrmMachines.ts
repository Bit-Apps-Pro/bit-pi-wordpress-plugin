import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import createLeadZohoCrm from './createLead.zohoCrm.machine'

export default defineFlowMachineRoot({
  appSlug: 'zohoCrm',
  machines: [createLeadZohoCrm]
})
