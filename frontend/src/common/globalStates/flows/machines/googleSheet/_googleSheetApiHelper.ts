import { type ApiResponseType, proxyRequest } from '@common/helpers/request'

type FilesType = ApiResponseType & { files: { name: string; id: string }[] }
type SheetsType = ApiResponseType & {
  sheets: { properties: { title: string; sheetId: number; gridProperties: { columnCount: number } } }[]
}

export const getFiles = async (accessToken: string): Promise<FilesType> => {
  const { data } = await proxyRequest<FilesType>({
    url: 'https://www.googleapis.com/drive/v3/files',
    method: 'GET',
    queryParams: {
      q: "mimeType='application/vnd.google-apps.spreadsheet'"
    },
    headers: {
      Authorization: ['Bearer ', accessToken]
    },
    encrypted: ['headers.Authorization.1']
  })

  return data
}

export const getSheets = async (accessToken: string, spreadsheetId: string): Promise<SheetsType> => {
  const { data } = await proxyRequest<SheetsType>({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    method: 'GET',
    queryParams: {
      fields: 'sheets.properties.title,sheets.properties.gridProperties.columnCount'
    },
    headers: {
      Authorization: ['Bearer ', accessToken]
    },
    encrypted: ['headers.Authorization.1']
  })

  return data
}
