import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'

type ConnectionType = {
  id: number
  connection_name: string
  auth_type: string
  account_name: string
  auth_details: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  app_slug: AppsSlugType
}

type ConnectionsType = { data: ConnectionType[] } | undefined
