import { type FlowMachineType } from '@common/globalStates/flows/FlowMachineType'
import { defineFlowMachine } from '@common/helpers/defineFlowMachine'

import { fetchSheets, fetchSpreadSheets, setRowData } from './_googleSheetMachineHelper'

export default defineFlowMachine(({ helpers }) => ({
  appSlug: 'googleSheet',
  runType: 'action',
  triggerType: 'SCHEDULE',
  machineSlug: 'addRowMachine',
  label: 'Add Row',
  states: {
    components: [
      {
        id: 'connection-id',
        fieldType: 'config',
        componentName: helpers.componentName.connection,
        label: 'Select Connection',
        render: true,
        onConnectionChange: 'SET_CONNECTION',
        onConnectionAddChange: 'CONNECTION_ADD_CHANGE',
        helpingText:
          'You can find credentials from <a target="_blank" href="https://console.cloud.google.com/apis/credentials">Here</a>',
        value: undefined,
        connectionsTypes: [
          {
            type: 'oauth2',
            label: 'OAuth',
            encryptKeys: ['access_token', 'refresh_token', 'client_secret'],
            authCodeEndpoint: {
              url: 'https://accounts.google.com/o/oauth2/v2/auth',
              method: 'GET',
              queryParams: {
                scope:
                  'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly',
                client_id: '',
                response_type: 'code',
                access_type: 'offline',
                prompt: 'consent'
              }
            },
            tokenEndpoint: {
              url: 'https://oauth2.googleapis.com/token',
              method: 'POST',
              bodyParams: {
                grant_type: 'authorization_code',
                client_id: '',
                client_secret: ''
              }
            },
            verifyConnection: {
              url: 'https://www.googleapis.com/oauth2/v2/tokeninfo',
              method: 'GET',
              queryParams: {
                access_token: '$_access_token_$'
              },
              response: {
                scope:
                  'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly'
              }
            }
          }
        ]
      },
      {
        id: 'spreadsheet-id',
        fieldType: 'config',
        componentName: helpers.componentName.select,
        label: 'Spreadsheet',
        placeholder: 'Select a spreadsheet',
        render: false,
        onChange: 'SELECT_SPREADSHEET',
        onRefetchClick: 'REFETCH_SPREADSHEETS',
        value: undefined,
        options: []
      },
      {
        id: 'sheet-title',
        fieldType: 'config',
        componentName: helpers.componentName.select,
        label: 'Sheet',
        placeholder: 'Select a sheet',
        render: false,
        onChange: 'SELECT_SHEET',
        onRefetchClick: 'REFETCH_SHEETS',
        value: undefined,
        options: []
      },
      {
        id: 'row-data',
        path: 'rowData',
        componentName: helpers.componentName.repeaterField,
        label: 'Field Mapping',
        render: false,
        onChange: 'ON_CHANGE_ROW_DATA',
        value: [],
        addItemButtonLabel: 'Add Row',
        fieldsMetaData: [
          {
            componentName: helpers.componentName.select,
            label: 'Column',
            name: 'column',
            value: '',
            options: [],
            required: true,
            style: { width: 100 }
          },
          {
            componentName: helpers.componentName.mixInput,
            label: 'Value',
            name: 'value',
            value: '',
            required: true,
            wrapperClassName: 'w-100'
          }
        ]
      }
    ]
  },

  actions: {
    INIT: async ({ $ }) => {
      await fetchSpreadSheets($, helpers)
      await fetchSheets($, helpers)
      await setRowData($, helpers)
    },

    CONNECTION_ADD_CHANGE: ({ data, $ }) => {
      if (!helpers.isConnectionComponent($.this)) return

      $.this.connectionsTypes.forEach(item => {
        if (item.type === 'oauth2' && item.authCodeEndpoint.queryParams) {
          item.authCodeEndpoint.queryParams.client_id = data.value.clientId

          if (item.tokenEndpoint.bodyParams) {
            item.tokenEndpoint.bodyParams.client_id = data.value.clientId
            item.tokenEndpoint.bodyParams.client_secret = data.value.clientSecret
          }
        }
      })
    },

    SET_CONNECTION: async ({ data, $ }) => {
      if (!helpers.isConnectionComponent($.this)) return

      $.this.value = data.value

      const sheetIdList = $('spreadsheet-id')
      sheetIdList.render = true
      await fetchSpreadSheets($, helpers)
    },

    REFETCH_SPREADSHEETS: async ({ $ }) => {
      await fetchSpreadSheets($, helpers)
    },

    SELECT_SPREADSHEET: async ({ data, $ }) => {
      if (!helpers.isSelectComponent($.this)) return

      $.this.value = data.value

      const sheetId = $('sheet-title')
      sheetId.render = true
      sheetId.value = undefined
      await fetchSheets($, helpers)
    },

    SELECT_SHEET: async ({ data, $ }) => {
      if (!helpers.isSelectComponent($.this)) return

      $.this.value = data.value

      const rowData = $('row-data')
      rowData.render = true
      await setRowData($, helpers)
    },

    REFETCH_SHEETS: async ({ $ }) => {
      await fetchSheets($, helpers)
      await setRowData($, helpers)
    },

    ON_CHANGE_ROW_DATA: ({ data, $ }) => {
      if (!helpers.isRepeaterFieldComponent($.this)) return

      $.this.value = data.value
    }
  }
})) satisfies FlowMachineType
