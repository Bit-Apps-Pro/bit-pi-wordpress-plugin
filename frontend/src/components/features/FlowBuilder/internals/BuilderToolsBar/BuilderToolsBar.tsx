import { type MouseEventHandler } from 'react'
import { useReactFlow } from 'reactflow'

import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import { Button, Space } from 'antd'

export default function BuilderToolsBar() {
  const { fitView, zoomIn, zoomOut } = useReactFlow()

  return (
    <div css={ut({ pos: 'absolute', l: 10, b: 10, z: 99 })}>
      <Space.Compact size="small" direction="vertical">
        <Button title="Zoom In" size="small" onClick={zoomIn as MouseEventHandler}>
          <LucideIcn name="plus" size={14} />
        </Button>
        <Button title="Zoom Out" size="small" onClick={zoomOut as MouseEventHandler}>
          <LucideIcn name="minus" size={14} />
        </Button>
        <Button title="Fit View" size="small" onClick={fitView as MouseEventHandler}>
          <LucideIcn name="maximize" size={14} />
        </Button>
      </Space.Compact>
    </div>
  )
}
