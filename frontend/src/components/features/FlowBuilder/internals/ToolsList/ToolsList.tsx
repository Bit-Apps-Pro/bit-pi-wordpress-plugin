import Tool from '@components/features/FlowBuilder/internals/Tool'
import { type ToolType } from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'

export default function ToolsList({ tools }: { tools: ToolType[] }) {
  return (
    <div className="flx gap-3 ta-cen jc-sb flx-wrap m-1">
      {tools.map(tool => (
        <Tool key={tool.slug} title={tool.title} appConfig={tool} />
      ))}
    </div>
  )
}
