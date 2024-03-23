import { type ReactNode } from 'react'

import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import ConditionIcn from '@icons/ConditionIcn'
import LucideIcn from '@icons/LucideIcn'
import RouterIcn from '@icons/RouterIcn'

export interface ToolType {
  title: string
  icon: ReactNode
  type: string
  tags: string[]
  slug: string
  color?: string
}

const toolsListData: ToolType[] = [
  {
    title: 'Router',
    slug: 'router',
    icon: <RouterIcn />,
    type: NodeTypeDef.router,
    tags: ['router']
  },
  {
    title: 'Condition',
    slug: 'condition',
    icon: <ConditionIcn size="42" stroke={4} />,
    type: NodeTypeDef.condition,
    tags: ['condition']
  },
  {
    title: 'Delay',
    slug: 'delay',
    icon: <LucideIcn name="clock" size={42} strokeWidth={2} />,
    type: NodeTypeDef.delay,
    tags: ['delay', 'sleep']
  }
]

export type Slug<T> = T extends { slug: infer S } ? S : never
export type ToolSlug = Slug<ToolType>
export default toolsListData
