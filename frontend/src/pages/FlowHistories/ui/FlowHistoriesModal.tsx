import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { SyncOutlined } from '@ant-design/icons'
import useFlowHistories from '@pages/FlowHistories/data/useFlowHistories'
import { Badge, Button, Empty, Modal, Space, Table, Typography } from 'antd'
import { type ColumnsType } from 'antd/es/table'

import FlowLogs from './FlowLogs'
import ReExecuteButton from './ReExecuteButton'

type Columns = {
  openDrawerHandler: (id: number) => void
}

const columns = ({ openDrawerHandler }: Columns): ColumnsType<FlowHistoryType> => [
  {
    title: 'CREATED AT',
    dataIndex: 'created_at',
    key: 'created_at'
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    render: (status: string) => {
      let color
      if (status === 'success') color = 'green'
      else if (status === 'failed') color = 'red'
      else if (status === 'processing') color = 'blue'
      else if (status === 'partial-success') color = 'yellow'

      return <Badge text={status.toUpperCase()} color={color} />
    }
  },
  {
    title: 'DURATION',
    dataIndex: 'duration',
    key: 'duration',
    render: (duration: number) => `${duration} sec`
  },
  {
    title: 'OPERATIONS',
    dataIndex: 'operations',
    key: 'operations'
  },
  {
    title: 'DATA TRANSFER',
    dataIndex: 'data_size',
    key: 'data_size',
    render: (size: number) => `${size} KB`
  },
  {
    title: 'ACTIONS',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right',
    width: 220,
    render: (_, record) => (
      <Space>
        <Button onClick={() => openDrawerHandler(record.id)}>Details</Button>
        <ReExecuteButton />
      </Space>
    )
  }
]

export default function FlowHistoriesModal({ closeModal }: { closeModal: () => void }) {
  const flowId = Number(useParams()?.flowId)
  const [historyId, setHistoryId] = useState<number>(0)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [pageLimit, setPageLimit] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { histories, isLogLoading, totalItems, isLogFetching, refetchLogs } = useFlowHistories(
    flowId,
    pageNumber,
    pageLimit
  )

  const onClose = () => {
    setOpenDrawer(false)
  }

  const setPagination = (page: number, pageSize: number) => {
    setPageNumber(page)
    setPageLimit(pageSize)
  }

  const openDrawerHandler = (id: number) => {
    setHistoryId(id)
    setOpenDrawer(true)
  }

  if (Number.isNaN(flowId)) return <Empty className="mt-4" />

  return (
    <Modal
      title={
        <Space size="middle">
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            Flow Logs
          </Typography.Title>
          <Button onClick={() => refetchLogs()} icon={<SyncOutlined spin={isLogFetching} />}>
            Refresh{isLogFetching && 'ing...'}
          </Button>
        </Space>
      }
      centered
      width={1024}
      style={{ maxHeight: 'calc(100vh - 32px)', marginTop: 32 }}
      open
      onCancel={closeModal}
      footer={false}
    >
      <Table
        loading={isLogLoading}
        dataSource={histories}
        pagination={{
          current: pageNumber,
          showSizeChanger: true,
          total: totalItems,
          pageSize: pageLimit,
          pageSizeOptions: ['10', '15', '20', '50'],
          onChange: (page: number, pageSize: number) => setPagination(page, pageSize),
          style: { marginBottom: 0 }
        }}
        rowKey={record => record.id}
        columns={columns({ openDrawerHandler })}
        size="small"
        scroll={{ x: 800 }}
      />

      <FlowLogs openDrawer={openDrawer} onClose={onClose} historyId={historyId} />
    </Modal>
  )
}
