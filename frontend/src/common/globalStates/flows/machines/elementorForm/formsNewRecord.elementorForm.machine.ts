import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

export default defineFlowMachine(({ helpers }) => ({
  appSlug: 'elementorForm',
  runType: 'trigger',
  triggerType: 'WP_HOOK',
  machineSlug: 'formsNewRecord',
  label: 'Forms New Record',
  states: {
    components: [
      {
        id: 'hook-listener',
        render: true,
        fieldType: 'config',
        label: 'Listen Hook',
        componentName: helpers.componentName.hookListener
      }
    ]
  },

  actions: {
    INIT: async () => {}
  }
})) satisfies FlowMachineType
