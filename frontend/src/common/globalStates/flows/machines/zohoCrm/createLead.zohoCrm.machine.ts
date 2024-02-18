/* eslint-disable no-param-reassign */
import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

export default defineFlowMachine(({ helpers }) => ({
  appSlug: 'zohoCrm',
  runType: 'action',
  triggerType: 'SCHEDULE',
  machineSlug: 'createLeadMachine',
  label: 'Create a Lead',
  states: {
    components: [
      {
        id: 'connection-id',
        componentName: helpers.componentName.connection,
        label: 'Select Connection',
        render: true,
        isLoading: false,
        onConnectionChange: 'SET_CONNECTION',
        onConnectionAddChange: 'CONNECTION_ADD_CHANGE',
        value: undefined,
        connectionsTypes: [
          {
            type: 'oauth2',
            label: 'OAuth',
            encryptKeys: ['access_token', 'refresh_token', 'client_secret'],
            authCodeEndpoint: {
              url: 'https://accounts.zoho.com/oauth/v2/auth',
              method: 'GET',
              queryParams: {
                scope:
                  'ZohoCRM.modules.leads.ALL,ZohoCRM.settings.fields.ALL,ZohoSearch.securesearch.READ',
                client_id: '',
                response_type: 'code',
                access_type: 'offline'
              }
            },
            tokenEndpoint: {
              url: 'https://accounts.zoho.com/oauth/v2/token',
              method: 'POST',
              bodyParams: {
                grant_type: 'authorization_code',
                client_id: '',
                client_secret: ''
              }
            }
          }
        ]
      },
      {
        id: 'user-name',
        componentName: helpers.componentName.input,
        label: 'User Name',
        render: false,
        onChange: 'HANDLE_INPUT',
        value: '',
        type: 'text'
      }
    ]
  },

  actions: {
    INIT: () => {},

    CONNECTION_ADD_CHANGE: ({ data, $ }) => {
      if (!helpers.isConnectionComponent($.this)) return

      $.this.connectionsTypes.forEach(item => {
        if (item.type !== 'oauth2') return
        if (item.authCodeEndpoint.queryParams) {
          item.authCodeEndpoint.queryParams.client_id = data.value.clientId
        }
        if (item.tokenEndpoint.bodyParams) {
          item.tokenEndpoint.bodyParams.client_id = data.value.clientId
          item.tokenEndpoint.bodyParams.client_secret = data.value.clientSecret
        }
      })
    },

    SET_CONNECTION: ({ data, $ }) => {
      if (!helpers.isConnectionComponent($.this)) return
      $.this.value = data.value
      $('user-name').render = true
    },

    HANDLE_INPUT: async ({ data, $ }) => {
      if (!helpers.isInputComponent($.this)) return

      const connection = await $.getConnection('expires_in')
      console.log('🚀', JSON.parse(JSON.stringify(connection)))

      $.this.value = data.value.target.value
    }
  }
})) satisfies FlowMachineType
