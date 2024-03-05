import ReactJson, { type ThemeKeys, type ThemeObject } from 'react-json-view'

import { $appConfig } from '@common/globalStates'
import { extractNodeId } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import useFlowLogs, { type Log } from '@pages/FlowHistories/data/useFlowLogs'
import {
  Badge,
  Collapse,
  type CollapseProps,
  Divider,
  Drawer,
  Skeleton,
  Space,
  Timeline,
  Typography
} from 'antd'
import { useAtomValue } from 'jotai'

import ReExecuteButton from './ReExecuteButton'

interface FlowLogDetailsProps {
  openDrawer: boolean
  onClose: () => void
  historyId: number
}

type ThemeType = ThemeObject | ThemeKeys

const logStatus = (status: string) => {
  if (status === 'success') return 'green'
  if (status === 'error') return 'red'
}

const collapseItems = (item: Log, theme?: ThemeType): CollapseProps['items'] => [
  {
    key: item.id,
    label: (
      <Space size={0} direction="vertical">
        <Space>
          <Typography.Text strong className="capitalize">
            {item?.node?.app_slug}
          </Typography.Text>

          <Badge count={extractNodeId(item.node_id)} color="#5273e0" style={{ color: 'white' }} />
        </Space>
        {item?.node?.machine_label && <Typography.Text>{item.node.machine_label}</Typography.Text>}
      </Space>
    ),
    extra: (
      <Space direction="vertical" align="end" size={0}>
        <Badge text={item.status} color={logStatus(item.status)} className="capitalize" />
        <Space size="middle">
          {item.details?.duration && (
            <Typography.Text>Duration: {item.details.duration}s </Typography.Text>
          )}
          {item.details?.data_size && (
            <Typography.Text>Size: {item.details.data_size} KB </Typography.Text>
          )}
        </Space>
      </Space>
    ),
    children: (
      <>
        {item.message && <Typography.Paragraph>{item.message}</Typography.Paragraph>}

        {item.input && (
          <>
            <ReactJson name="Input" collapsed src={item.input} theme={theme} />
            <Divider style={{ marginBlock: 6 }} />
          </>
        )}

        {item.output && <ReactJson name="Output" collapsed src={item.output} theme={theme} />}

        {/* <Collapse
          size="small"
          variant="borderless"
          style={{ padding: '0 !important' }}
          items={[
            {
              key: `${item.id}-input`,
              label: 'Input',
              children: <ReactJson name={false} src={item.input} theme={theme} />
            },
            {
              key: `${item.id}-output`,
              label: 'Output',
              children: <ReactJson name={false} src={item.output} theme={theme} />
            }
          ]}
        /> */}
      </>
    )
  }
]

const timelineLogs = (logs: Log[], theme: ThemeType) =>
  logs.map(item => ({
    color: logStatus(item.status),
    children: <Collapse bordered size="small" items={collapseItems(item, theme)} />
  }))

export default function FlowLogs({ openDrawer, onClose, historyId }: FlowLogDetailsProps) {
  const { isDarkTheme } = useAtomValue($appConfig)
  const theme = isDarkTheme ? 'hopscotch' : 'rjv-default'
  const { isLoading, logs } = useFlowLogs(historyId)

  return (
    <div>
      <Drawer
        title="Log Details"
        placement="right"
        width={720}
        onClose={onClose}
        open={openDrawer}
        contentWrapperStyle={{ top: '32px' }}
        extra={
          <Space>
            <ReExecuteButton />
          </Space>
        }
      >
        <Skeleton loading={isLoading} active>
          <Timeline items={timelineLogs(logs, theme)} />
        </Skeleton>
      </Drawer>
    </div>
  )
}
