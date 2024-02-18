import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

export default defineFlowMachine(({ helpers }) => ({
  appSlug: 'googleCalendar',
  triggerType: 'SCHEDULE',
  machineSlug: 'createEvent',
  runType: 'action',
  label: 'Create Event',
  states: {
    components: [
      {
        id: 'input',
        componentName: helpers.componentName.mixInput,
        label: 'Event Title',
        render: true,
        onChange: 'HANDLE_INPUT',
        value: undefined
      }
    ]
  },

  actions: {
    INIT: () => {},

    HANDLE_INPUT: ({ data, $ }) => {
      if (!helpers.isInputComponent($.this)) return

      $.this.value = data.value
    }
  }
})) satisfies FlowMachineType
