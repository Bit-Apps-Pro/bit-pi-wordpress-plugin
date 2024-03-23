import useDeleteWebhook from '@features/Webhook/data/useDeleteWebhook'
import useWebhooks from '@features/Webhook/data/useWebhooks'
import LucideIcn from '@icons/LucideIcn'
import { Button, Divider, List, Popconfirm, Space, Typography } from 'antd'

const { Title, Text, Link } = Typography

export default function Webhooks() {
  const { webhooks, isWebhookLoading } = useWebhooks()
  const { deleteWebhook } = useDeleteWebhook()

  return (
    <div className="p-6">
      <Title level={3}>Webhooks</Title>

      <Divider style={{ marginTop: 6 }} />

      <List
        loading={isWebhookLoading}
        itemLayout="horizontal"
        dataSource={webhooks}
        renderItem={webhook => (
          <List.Item
            actions={[
              <Popconfirm
                onConfirm={async () => deleteWebhook(webhook.id)}
                okText="Yes"
                cancelText="No"
                title="Delete the webhook"
                description="Are you sure to delete this webhook?"
                icon={<LucideIcn name="trash-2" color="red" />}
              >
                <Button icon={<LucideIcn name="trash-2" />}>Delete</Button>
              </Popconfirm>
            ]}
          >
            <Space direction="vertical" size={0}>
              <Text css={{ fontWeight: 500 }}>{webhook.title}</Text>
              <Link
                href={webhook.url}
                copyable={{
                  icon: [<LucideIcn name="copy" />]
                }}
              >
                {webhook.url}
              </Link>
            </Space>
          </List.Item>
        )}
      />
    </div>
  )
}
