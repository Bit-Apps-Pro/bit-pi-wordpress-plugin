import useConnections from '@features/Connection/data/useConnections'
import useDeleteConnection from '@features/Connection/data/useDeleteConnection'
import { getAppBySlug } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import LucideIcn from '@icons/LucideIcn'
import { Avatar, Button, List, Popconfirm, Skeleton, Typography } from 'antd'

import css from './Connections.module.css'
import cItemCss from './Connections.style'

const { Title } = Typography

export default function Connections() {
  const { connections, isConnectionLoading } = useConnections()
  const { deleteConnection } = useDeleteConnection()

  return (
    <div className="p-6">
      <Title level={3}>Connections</Title>

      <List
        loading={isConnectionLoading}
        itemLayout="horizontal"
        dataSource={connections}
        renderItem={connection => {
          const app = getAppBySlug(connection.app_slug)
          return (
            <List.Item
              actions={[
                <Popconfirm
                  onConfirm={async () => deleteConnection(connection.id)}
                  okText="Yes"
                  cancelText="No"
                  title="Delete the connection"
                  description="Are you sure to delete this connection?"
                  icon={<LucideIcn name="trash-2" color="red" />}
                >
                  <Button icon={<LucideIcn name="trash-2" />}>Delete</Button>
                </Popconfirm>
              ]}
            >
              <Skeleton avatar title={false} loading={isConnectionLoading} active>
                <List.Item.Meta
                  title={connection.connection_name}
                  description={connection.account_name || 'Untitled name!'}
                  avatar={
                    <Avatar
                      src={app?.iconURL}
                      className={css.avatar}
                      css={cItemCss().avatar(app?.color)}
                    />
                  }
                />
              </Skeleton>
            </List.Item>
          )
        }}
      />
    </div>
  )
}
