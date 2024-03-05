interface WebhookDetailsType {
  title: string
  app_slug: string
}

interface WebhookType extends WebhookDetailsType {
  id: number
  webhook_slug: string
  url: string
}

type WebhookResType = { data: WebhookType[] } | undefined

type WebhookPropsType = {
  appSlug: string
  value?: number
  wrapperClassName?: string
  onWebhookChange: (value: number) => void
  onSave?: (value: WebhookDetailsType) => void
  onRender?: (e?: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}
