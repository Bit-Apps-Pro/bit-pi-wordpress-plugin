import { type ApiResponseType, proxyRequest } from '@common/helpers/request'
import { type VerifyConnectionType } from '@features/Connection/ConnectionType'

async function verifyConnection(connection?: VerifyConnectionType) {
  if (!connection) return true

  const response = await proxyRequest<ApiResponseType>(connection)

  const itemIndex = Object.entries(connection.response).findIndex(
    ([key, value]) => response.data[key] !== value
  )

  return itemIndex === -1
}

export default verifyConnection
