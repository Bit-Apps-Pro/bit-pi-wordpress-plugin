import { type ComponentType } from '@common/globalStates/flows/FlowMachineType'
import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'

type ComponentRenderer = {
  nodeId: string
  appName?: string
  appSlug?: AppsSlugType
  components: ComponentType[]
}
