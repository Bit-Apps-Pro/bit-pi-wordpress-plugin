import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

import { fetchForms } from './_bitFormMachineHelper'

export default defineFlowMachine(({ helpers }) => ({
  appSlug: 'bitForm',
  runType: 'trigger',
  triggerType: 'WP_HOOK',
  machineSlug: 'submitSuccess',
  label: 'Submit Success',
  states: {
    components: [
      {
        id: 'form-id',
        render: true,
        fieldType: 'config',
        componentName: helpers.componentName.select,
        label: 'Forms',
        placeholder: 'Select a form',
        onChange: 'SELECT_FORM',
        onRefetchClick: 'REFETCH_FORMS',
        value: undefined,
        options: []
      },
      {
        id: 'hook-listener',
        render: false,
        fieldType: 'config',
        label: 'Listen Hook',
        componentName: helpers.componentName.hookListener
      }
    ]
  },

  actions: {
    INIT: async ({ $ }) => {
      await fetchForms($, helpers)
    },

    SELECT_FORM: async ({ data, $ }) => {
      if (!helpers.isSelectComponent($.this)) return

      $.this.value = data.value

      $('hook-listener').render = data.value !== ''
    },

    REFETCH_FORMS: async ({ $ }) => {
      await fetchForms($, helpers)
    }
  }
})) satisfies FlowMachineType
