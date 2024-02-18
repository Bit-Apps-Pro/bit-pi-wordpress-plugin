import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import condition from '@resource/img/tools/condition.svg'
import delay from '@resource/img/tools/delay.svg'
import router from '@resource/img/tools/router.svg'

export interface ToolType {
  title: string
  iconURL: string
  type: string
  tags: string[]
  slug: string
  color?: string
}

const toolsListData: ToolType[] = [
  {
    title: 'Router',
    slug: 'router',
    iconURL: router,
    type: NodeTypeDef.router,
    tags: ['router']
  },
  {
    title: 'Condition',
    slug: 'condition',
    iconURL: condition,
    type: NodeTypeDef.condition,
    tags: ['condition']
  },
  {
    title: 'Delay',
    slug: 'delay',
    iconURL: delay,
    type: NodeTypeDef.delay,
    tags: ['delay', 'sleep']
  }
]

export type Slug<T> = T extends { slug: infer S } ? S : never
export type ToolSlug = Slug<ToolType>
export default toolsListData
