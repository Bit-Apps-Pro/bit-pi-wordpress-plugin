import { type MachineUtilityType } from '@common/globalStates/flows/FlowMachineType'
import { type HelpersType } from '@common/helpers/defineFlowMachine'

import { getFiles, getSheets } from './_googleSheetApiHelper'

export const fetchSpreadSheets = async ($: MachineUtilityType, helpers: HelpersType) => {
  const sheetIdList = $('spreadsheet-id')
  sheetIdList.loading = true
  $.setNode()

  const connection = await $.getConnection('expires_in')

  if (connection) {
    if (helpers.isSelectComponent(sheetIdList)) {
      const data = await getFiles(connection.auth_details.access_token)

      sheetIdList.options = data?.files?.map(file => ({
        label: file.name,
        value: file.id
      }))
    }
  }

  sheetIdList.loading = false
}

export const fetchSheets = async ($: MachineUtilityType, helpers: HelpersType) => {
  const sheetIdList = $('sheet-title')
  sheetIdList.loading = true
  $.setNode()

  const connection = await $.getConnection('expires_in')

  if (connection) {
    if (helpers.isSelectComponent(sheetIdList)) {
      const data = await getSheets(connection.auth_details.access_token, $('spreadsheet-id').value)

      sheetIdList.options = data?.sheets?.map(sheet => ({
        label: sheet.properties.title,
        value: sheet.properties.title
      }))
    }
  }

  sheetIdList.loading = false
}

export const sheetColumnOptions = (columCount = 26) => {
  const options = []

  for (let i = 0; i < columCount; i += 1) {
    let charNum = i
    let secondChar = ''

    if (i > 25) {
      secondChar = String.fromCharCode(65 + (i % 26))
      charNum = Math.floor(i / 26) - 1
    }

    const firstChar = String.fromCharCode(65 + charNum)
    options.push({
      label: firstChar + secondChar,
      value: firstChar + secondChar
    })
  }

  return options
}

export const setRowData = async ($: MachineUtilityType, helpers: HelpersType) => {
  const rowData = $('row-data')
  rowData.loading = true
  $.setNode()

  const connection = await $.getConnection('expires_in')

  if (connection && helpers.isRepeaterFieldComponent(rowData)) {
    const selectMeta = rowData.fieldsMetaData[0]
    if (helpers.isSelectComponent(selectMeta)) {
      const data = await getSheets(connection.auth_details.access_token, $('spreadsheet-id').value)

      const columnCount = data?.sheets?.find(sheet => sheet.properties.title === $('sheet-title').value)
        ?.properties.gridProperties.columnCount

      selectMeta.options = sheetColumnOptions(columnCount)
    }
  }

  rowData.loading = false
}
