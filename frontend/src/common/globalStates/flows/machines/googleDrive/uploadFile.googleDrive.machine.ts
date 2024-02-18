import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

export default defineFlowMachine(({ helpers }) => ({
  machineSlug: 'uploadFile',
  runType: 'action',
  triggerType: 'SCHEDULE',
  appSlug: 'googleDrive',
  label: 'Upload File',
  states: {
    components: [
      {
        id: 'input',
        componentName: helpers.componentName.input,
        label: 'Folder Name',
        render: true,
        type: 'text',
        onChange: 'HANDLE_INPUT',
        value: ''
      }
    ]
  },

  actions: {
    INIT: () => {},

    HANDLE_INPUT: ({ data, $ }) => {
      if (!helpers.isInputComponent($.this)) return

      $.this.value = data.value.target.value
    }
  }
})) satisfies FlowMachineType
