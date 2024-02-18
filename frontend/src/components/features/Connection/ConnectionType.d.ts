import { type AuthCodeResponseType } from '@common/globalStates/$shareOauthInfo'
import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'

export interface EndpointType {
  url: string
  method: 'GET' | 'POST'
  queryParams?: Record<string, string | number | string[]>
  bodyParams?: Record<string, string | number | string[]>
  headers?: Record<string, string | number | string[]>
  encrypted?: string[]
}
export interface VerifyConnectionType extends EndpointType {
  response: Record<string, string | number>
}

interface BaseConnectionType {
  label: string
  verifyConnection?: VerifyConnectionType
  encryptKeys?: string[]
}
interface ConnectionOauth2Type extends BaseConnectionType {
  type: 'oauth2'
  authCodeEndpoint: EndpointType
  tokenEndpoint: EndpointType
  userInfoEndpoint?: EndpointType
}
interface ConnectionTokenType extends BaseConnectionType {
  type: 'token'
}
export type ConnectionTypesType = ConnectionTokenType | ConnectionOauth2Type

interface TokenConnectionDetailsType {
  type: 'token'
  connectionName: string
  token: string
}
interface Oauth2ConnectionDetailsType {
  type: 'oauth2'
  connectionName: string
  accountName: string
  clientId: string
  clientSecret: string
}
interface DefaultConnectionDetailsType {
  type: undefined
  connectionName: string
}
export type ConnectionDetailsType =
  | TokenConnectionDetailsType
  | Oauth2ConnectionDetailsType
  | DefaultConnectionDetailsType

interface QueryParams {
  [key: string]: string
}

export interface ConnectionPropsType {
  label?: string
  value?: number
  appName: string
  appSlug: AppsSlugType
  loading?: boolean
  helpingText?: string
  wrapperClassName?: string
  connectionsTypes: ConnectionTypesType[]
  onConnectionChange: (connectionId: number) => void
  onConnectionAddChange?: (connectionDetails: ConnectionDetailsType) => void
  onConnectionSaveClick?: (connectionDetails: ConnectionDetailsType) => void
  onRender?: (e?: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}

type AuthTypes = 'token' | 'oauth2'

export type SetShareOauthInfoType = (
  value: AuthCodeResponseType | ((value: AuthCodeResponseType) => AuthCodeResponseType)
) => void
