import $shareOauthInfo, { type AuthCodeResponseType } from '@common/globalStates/$shareOauthInfo'
import { type ApiResponseType, proxyRequest } from '@common/helpers/request'
import config from '@config/config'
import { type ConnectionTypesType, type EndpointType } from '@features/Connection/ConnectionType'
import { getDefaultStore } from 'jotai'
import { create } from 'mutative'

const store = getDefaultStore()
const readAtom = store.get
const writeAtom = store.set

const redirectURI = `${config.API_URL.base}/oauthCallback`

const getAuthUrl = ({ url, queryParams }: EndpointType) => {
  const authUrl = new URL(url)
  if (!queryParams) return authUrl

  Object.entries(queryParams).forEach(([key, value]) => authUrl.searchParams.append(key, String(value)))
  authUrl.searchParams.append('state', window.location.href)
  authUrl.searchParams.append('redirect_uri', redirectURI)

  return authUrl
}

export const connectionOauth2 = (
  connection: ConnectionTypesType,
  setLoading: (value: boolean) => void
) => {
  if (connection.type !== 'oauth2' || !connection.authCodeEndpoint) {
    console.error('Auth code endpoint is not defined')
    return false
  }

  const openedWindow = window.open(
    getAuthUrl(connection.authCodeEndpoint),
    connection.label,
    'width=500,height=600,toolbar=off'
  )

  const windowCloseChecker = setInterval(() => {
    if (!openedWindow?.closed) return
    clearInterval(windowCloseChecker)

    if (Object.keys(readAtom($shareOauthInfo)).length < 1) {
      setLoading(false)
    }
  }, 1000)
}

const processAuthCode = () => {
  const shareOauthInfo = readAtom($shareOauthInfo)

  if (Object.keys(shareOauthInfo).length > 0) {
    writeAtom($shareOauthInfo, {})
    return shareOauthInfo
  }

  console.error('Auth code is not valid')
  return false
}

const processAuthToken = async (
  connection: ConnectionTypesType,
  authCodeResponse: AuthCodeResponseType
) => {
  if (
    connection.type !== 'oauth2' ||
    !connection.tokenEndpoint ||
    !connection.tokenEndpoint.bodyParams
  ) {
    console.error('Token endpoint or body params is not defined')
    return false
  }

  const requestData = create(connection.tokenEndpoint, draft => {
    if (draft.bodyParams) {
      draft.bodyParams.redirect_uri = redirectURI
      draft.bodyParams.code = decodeURIComponent(authCodeResponse.code)
    }
  })

  const authTokenRes = await proxyRequest<ApiResponseType>(requestData)

  if (authTokenRes.status === 'error' || !authTokenRes?.data || 'error' in authTokenRes.data) {
    console.error('Auth token is not valid')
    return false
  }

  return authTokenRes?.data
}

export const getAuthToken = async (connection: ConnectionTypesType) => {
  const authCode = processAuthCode()
  if (!authCode) return false

  const authToken = await processAuthToken(connection, authCode)
  if (!authToken) return false

  return authToken
}

export const saveAuthCodeResponse = () => {
  const authCodeResponse: AuthCodeResponseType = {}
  const windowURL = new URL(window.location.href)
  const queryParams = windowURL.hash.split('&')

  if (queryParams) {
    queryParams.forEach(element => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        authCodeResponse[gtKeyValue[0]] = gtKeyValue[1] // eslint-disable-line prefer-destructuring
      }
    })
  }

  writeAtom($shareOauthInfo, { ...authCodeResponse })
  window.close()
}
