import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

export default defineFlowMachine(({ helpers }) => ({
  appSlug: 'jotForm',
  runType: 'action',
  triggerType: 'SCHEDULE',
  machineSlug: 'createFormMachine',
  label: 'Create Form',
  states: {
    components: [
      {
        id: 'connection-id',
        componentName: helpers.componentName.connection,
        label: 'Select Connection',
        fieldType: 'config',
        render: true,
        onConnectionChange: 'SET_CONNECTION',
        onConnectionAddChange: 'CONNECTION_ADD_CHANGE',
        value: undefined,
        isLoading: false,
        connectionsTypes: [
          {
            type: 'token',
            label: 'Token',
            encryptKeys: ['token'],
            verifyConnection: {
              url: 'https://api.jotform.com/user',
              method: 'GET',
              queryParams: { apiKey: '' },
              response: { message: 'success', responseCode: 200 }
            }
          }
        ]
      },
      {
        id: 'form-title',
        path: 'title',
        componentName: helpers.componentName.mixInput,
        label: 'Form Title',
        render: false,
        onChange: 'HANDLE_MIX_INPUT',
        value: undefined
      },
      {
        id: 'questions',
        componentName: helpers.componentName.repeaterField,
        label: 'Questions',
        render: false,
        loading: false,
        onChange: 'ON_CHANGE_QUESTIONS',
        value: [],
        addItemButtonLabel: 'Add Item',
        fieldsMetaData: [
          {
            componentName: helpers.componentName.input,
            label: 'Label',
            name: 'label',
            value: undefined,
            required: true,
            invalidMessage: ''
          },
          {
            componentName: helpers.componentName.input,
            label: 'Slug',
            name: 'slug',
            value: undefined,
            required: true,
            invalidMessage: ''
          },
          {
            componentName: helpers.componentName.select,
            label: 'Type',
            name: 'type',
            value: undefined,
            options: [
              { label: 'Header', value: 'control_head' },
              { label: 'Text', value: 'control_text' },
              { label: 'Textbox', value: 'control_textbox' },
              { label: 'Textarea', value: 'control_textarea' },
              { label: 'Dropdown', value: 'control_dropdown' },
              { label: 'Radio', value: 'control_radio' },
              { label: 'Checkbox', value: 'control_checkbox' },
              { label: 'Image', value: 'control_image' },
              { label: 'File Upload', value: 'control_fileupload' },
              { label: 'Button', value: 'control_button' }
            ],
            required: true,
            invalidMessage: ''
          },
          {
            componentName: helpers.componentName.input,
            label: 'Order',
            name: 'order',
            value: undefined,
            required: true,
            invalidMessage: ''
          }
        ]
      },
      {
        id: 'form-height',
        path: 'height',
        componentName: helpers.componentName.input,
        label: 'Form Height',
        render: false,
        onChange: 'HANDLE_INPUT',
        value: undefined,
        type: 'number'
      }
    ]
  },

  actions: {
    INIT: () => {},

    CONNECTION_ADD_CHANGE: ({ data, $ }) => {
      if (!helpers.isConnectionComponent($.this)) return

      $.this.connectionsTypes.forEach(item => {
        if (item.type === 'token' && item?.verifyConnection?.queryParams) {
          item.verifyConnection.queryParams.apiKey = data.value.token
        }
      })
    },

    SET_CONNECTION: ({ data, $, nodeDraft }) => {
      if (!helpers.isConnectionComponent($.this)) return

      $.this.value = data.value

      nodeDraft?.states?.components?.forEach(item => {
        item.render = true
      })
    },

    ON_CHANGE_QUESTIONS: ({ data, $ }) => {
      if (!helpers.isRepeaterFieldComponent($.this)) return

      $.this.value = data.value
    },

    HANDLE_INPUT: ({ data, $ }) => {
      if (!helpers.isInputComponent($.this)) return

      $.this.value = data.value.target.value
    },

    HANDLE_MIX_INPUT: ({ data, $ }) => {
      if (!helpers.isMixInputComponent($.this)) return

      $.this.value = data.value
    }
  }
})) satisfies FlowMachineType
