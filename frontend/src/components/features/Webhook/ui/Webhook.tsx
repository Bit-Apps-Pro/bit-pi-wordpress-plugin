/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import useSaveWebhook from '@features/Webhook/data/useSaveWebhook'
import useUpdateWebhook from '@features/Webhook/data/useUpdateWebhook'
import useWebhooks from '@features/Webhook/data/useWebhooks'
import HookListener from '@features/Webhook/ui/HookListener'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import Input from '@utilities/Input'
import InputCopyable from '@utilities/InputCopyable'
import Select from '@utilities/Select'
import { Button, Form, Popover, Row, Space, Typography } from 'antd'
import { create } from 'mutative'

const { Title } = Typography

const webhookDetailsDefault = (appSlug: string) => ({
  title: 'Untitled Webhook',
  app_slug: appSlug
})

export default function Webhook({
  appSlug,
  value,
  wrapperClassName,
  onWebhookChange,
  onSave,
  onRender
}: WebhookPropsType) {
  const flowId = Number(useParams()?.flowId)
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [webhookDetails, setWebhookDetails] = useState<WebhookDetailsType>(
    webhookDetailsDefault(appSlug)
  )
  const { webhooks } = useWebhooks(flowId, appSlug)
  const { saveWebhook, isSavingWebhook } = useSaveWebhook(flowId)
  const { updateWebhook } = useUpdateWebhook()

  useEffect(() => {
    onRender?.()
  }, [])

  const webhookOptions = webhooks.map(webhook => ({
    value: webhook.id,
    label: webhook.title
  }))

  const getWebhookCallbackURL = () => webhooks.find(webhook => webhook.id === value)?.url || ''

  const closePopover = () => {
    setIsPopoverOpen(false)
  }

  const handleInputChange = (key: 'title') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookDetails(prev =>
      create(prev, draft => {
        draft[key] = e.target.value
      })
    )
  }

  const handleSave = async () => {
    if (onSave) {
      onSave(webhookDetails)
    } else {
      const { data } = await saveWebhook({ ...webhookDetails, flow_id: flowId })
      onWebhookChange(data.id)
    }
    closePopover()
    setWebhookDetails(webhookDetailsDefault(appSlug))
  }

  const handleWebhookChange = async (webhookId: number) => {
    onWebhookChange(webhookId)
    updateWebhook({ webhook_id: webhookId, flow_id: flowId })
  }

  if (Number.isNaN(flowId)) return null

  return (
    <Space direction="vertical" css={{ width: '100%' }}>
      <Select
        wrapperClassName={wrapperClassName}
        label="Webhook"
        onChange={handleWebhookChange}
        value={value}
        placeholder="Choose a webhook"
        options={webhookOptions}
        disabled={isPopoverOpen}
        suffix={
          <Popover
            open={isPopoverOpen}
            trigger="click"
            placement="right"
            title={
              <Row justify="space-between">
                <Title level={5} css={ut({ mb: '0*' })}>
                  Create a webhook
                </Title>
                <Button
                  disabled={isSavingWebhook}
                  onClick={closePopover}
                  size="small"
                  type="text"
                  icon={<LucideIcn name="x" />}
                />
              </Row>
            }
            content={
              <Form onFinish={handleSave}>
                <Space direction="vertical">
                  <Input
                    label="Webhook name"
                    value={webhookDetails.title}
                    onChange={handleInputChange('title')}
                    disabled={isSavingWebhook}
                  />
                  <Row justify="end">
                    <Space>
                      <Button disabled={isSavingWebhook} onClick={closePopover}>
                        Cancel
                      </Button>
                      <Button htmlType="submit" loading={isSavingWebhook} type="primary">
                        Save
                      </Button>
                    </Space>
                  </Row>
                </Space>
              </Form>
            }
            overlayInnerStyle={{ marginTop: 40 }}
          >
            <Button disabled={isPopoverOpen} onClick={() => setIsPopoverOpen(true)}>
              Add
            </Button>
          </Popover>
        }
      />

      {value && (
        <>
          <InputCopyable label="Callback URL" value={getWebhookCallbackURL()} />
          <HookListener wrapperClassName="mt-1" />
        </>
      )}
    </Space>
  )
}
