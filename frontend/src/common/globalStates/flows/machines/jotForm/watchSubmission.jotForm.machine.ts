import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

export default defineFlowMachine(({ helpers }) => ({
  appSlug: 'jotForm',
  runType: 'trigger',
  triggerType: 'WEBHOOK',
  machineSlug: 'watchSubmission',
  label: 'Watch Submission',
  states: {
    components: [
      {
        id: 'webhook-select',
        componentName: helpers.componentName.webhook,
        label: 'Webhook',
        render: true,
        onWebhookChange: 'SET_WEBHOOK',
        value: undefined
      }
    ]
  },

  actions: {
    INIT: () => {},

    SET_WEBHOOK: ({ data, $ }) => {
      if (!helpers.isWebhookComponent($.this)) return

      $.this.value = data.value
    }
  }
})) satisfies FlowMachineType
