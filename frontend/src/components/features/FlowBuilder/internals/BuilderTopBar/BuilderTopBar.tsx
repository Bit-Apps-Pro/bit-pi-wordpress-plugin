import { useNavigate } from 'react-router-dom'

import TestFlowButton from '@features/FlowBuilder/internals/BuilderTopBar/TestFlowButton'
import ExportImport from '@features/FlowBuilder/internals/ExportImport'
import ChevronLeft from '@icons/ChevronLeft'
import FlowHistories from '@pages/FlowHistories'
import { Button, Space, Tooltip } from 'antd'

import css from './BuilderTopBarStyle.module.css'
import SavingMessage from './SavingMessage'

export default function BuilderTopBar() {
  const navigate = useNavigate()

  return (
    <>
      <div className={css.topLeftControls}>
        <Space>
          <Tooltip title="Go Back" placement="bottom">
            <Button
              size="large"
              shape="circle"
              icon={<ChevronLeft size="1em" stroke={2} />}
              onClick={() => navigate(-1)}
            />
          </Tooltip>

          <TestFlowButton />

          <SavingMessage />
        </Space>
      </div>

      <div className={css.topRightControls}>
        <FlowHistories />
        <ExportImport />
      </div>
    </>
  )
}
