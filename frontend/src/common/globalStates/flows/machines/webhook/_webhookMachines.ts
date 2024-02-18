import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import customWebhook from './customWebhook.webhook.machine'

export default defineFlowMachineRoot({
  appSlug: 'webhook',
  machines: [customWebhook]
})
