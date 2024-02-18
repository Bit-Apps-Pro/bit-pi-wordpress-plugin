import { useEffect } from 'react'

import { SyncOutlined } from '@ant-design/icons'
import $flowMachineSelector from '@common/globalStates/flows/$flowMachineSelector'
import ComponentName from '@common/globalStates/flows/ComponentNameType'
import { type MachineEventType } from '@common/globalStates/flows/FlowMachineType'
import Connection from '@features/Connection'
import Webhook from '@features/Webhook'
import HookListener from '@features/Webhook/ui/HookListener'
import AnimateHeight from '@utilities/AnimateHeight'
import Input from '@utilities/Input'
import MixInput from '@utilities/MixInput'
import RepeaterField from '@utilities/RepeaterField'
import Select from '@utilities/Select'
import { Button, Tooltip } from 'antd'
import { AnimatePresence } from 'framer-motion'
import { useSetAtom } from 'jotai'

import { type ComponentRenderer } from './ComponentsRendererType'

export default function ComponentsRenderer({ nodeId, appName, appSlug, components }: ComponentRenderer) {
  const dispatchEvent = useSetAtom($flowMachineSelector)

  useEffect(() => {
    dispatchEvent({
      actionType: 'INIT',
      data: { nodeId }
    })
  }, [])

  const handleComponentsEvents =
    (eventName: MachineEventType | undefined, componentIndex: number, componentId: string) =>
    (e?: unknown) => {
      if (!eventName) return

      dispatchEvent({
        actionType: eventName,
        data: { nodeId, value: e, componentIndex, componentId }
      })
    }

  const componentIds: Record<string | number, number> = {}

  return (
    <div>
      <AnimatePresence>
        {components?.map((component, i) => {
          const { id: componentId, componentName, render } = component

          if (componentIds[componentId]) {
            console.error(`Component id ${componentId} is duplicated`)
            return null
          }

          componentIds[componentId] = 1

          if (componentName === ComponentName.select && render) {
            const { onChange, onRender, onRefetchClick, loading, ...rest } = component

            return (
              <AnimateHeight key={componentId} style={{ paddingInline: 2 }}>
                <Select
                  wrapperClassName="mb-1 mt-1"
                  onChange={handleComponentsEvents(onChange, i, componentId)}
                  onRender={handleComponentsEvents(onRender, i, componentId)}
                  suffix={
                    onRefetchClick ? (
                      <Tooltip title="Refetch">
                        <Button
                          onClick={handleComponentsEvents(onRefetchClick, i, componentId)}
                          icon={<SyncOutlined size={14} spin={loading} />}
                          disabled={loading}
                        />
                      </Tooltip>
                    ) : null
                  }
                  {...rest} // eslint-disable-line react/jsx-props-no-spreading
                />
              </AnimateHeight>
            )
          }
          if (component.componentName === ComponentName.input && render) {
            const { onChange, onRender, ...rest } = component

            return (
              <AnimateHeight key={componentId} style={{ paddingInline: 2 }}>
                <Input
                  wrapperClassName="mb-1 mt-1"
                  onRender={handleComponentsEvents(onRender, i, componentId)}
                  onChange={handleComponentsEvents(onChange, i, componentId)}
                  {...rest} // eslint-disable-line react/jsx-props-no-spreading
                />
              </AnimateHeight>
            )
          }
          if (component.componentName === ComponentName.mixInput && render) {
            const { onChange, onRender, ...rest } = component

            return (
              <AnimateHeight key={componentId} style={{ paddingInline: 2 }}>
                <MixInput
                  wrapperClassName="mb-1 mt-1"
                  onChange={handleComponentsEvents(onChange, i, componentId)}
                  onRender={handleComponentsEvents(onRender, i, componentId)}
                  {...rest} // eslint-disable-line react/jsx-props-no-spreading
                />
              </AnimateHeight>
            )
          }
          if (component.componentName === ComponentName.connection && render && appSlug) {
            const { onConnectionChange, onConnectionAddChange, onRender, ...rest } = component
            return (
              <AnimateHeight key={componentId} style={{ paddingInline: 2 }}>
                <Connection
                  wrapperClassName="mb-1 mt-1"
                  appName={appName || ''}
                  appSlug={appSlug}
                  onConnectionChange={handleComponentsEvents(onConnectionChange, i, componentId)}
                  onConnectionAddChange={handleComponentsEvents(onConnectionAddChange, i, componentId)}
                  onRender={handleComponentsEvents(onRender, i, componentId)}
                  {...rest} // eslint-disable-line react/jsx-props-no-spreading
                />
              </AnimateHeight>
            )
          }
          if (component.componentName === ComponentName.repeaterField && render) {
            const { onChange, onRender, ...rest } = component

            return (
              <AnimateHeight key={componentId} style={{ paddingInline: 2 }}>
                <RepeaterField
                  wrapperClassName="mb-1 mt-1"
                  onChange={handleComponentsEvents(onChange, i, componentId)}
                  onRender={handleComponentsEvents(onRender, i, componentId)}
                  {...rest} // eslint-disable-line react/jsx-props-no-spreading
                />
              </AnimateHeight>
            )
          }
          if (component.componentName === ComponentName.webhook && render && appSlug) {
            const { onWebhookChange, onRender, ...rest } = component

            return (
              <AnimateHeight key={componentId} style={{ padding: 2 }}>
                <Webhook
                  wrapperClassName="mb-1 mt-1"
                  appSlug={appSlug}
                  onWebhookChange={handleComponentsEvents(onWebhookChange, i, componentId)}
                  onRender={handleComponentsEvents(onRender, i, componentId)}
                  {...rest} // eslint-disable-line react/jsx-props-no-spreading
                />
              </AnimateHeight>
            )
          }
          if (component.componentName === ComponentName.hookListener && render) {
            return (
              <AnimateHeight key={componentId} style={{ padding: 2 }}>
                <HookListener wrapperClassName="mb-1 mt-1" />
              </AnimateHeight>
            )
          }
        })}
      </AnimatePresence>
    </div>
  )
}
