import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import submissionInserted from './submissionInserted.fluentForms.machine'

export default defineFlowMachineRoot({
  appSlug: 'fluentForms',
  machines: [submissionInserted]
})
