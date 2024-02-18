import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import createFormJotForm from './createForm.jotForm.machine'
import watchSubmissionJotForm from './watchSubmission.jotForm.machine'

export default defineFlowMachineRoot({
  appSlug: 'jotForm',
  machines: [watchSubmissionJotForm, createFormJotForm]
})
