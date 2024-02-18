/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react'
import { type MixInputValue } from 'react-mix-tag-input'

import AppsTabContent from '@features/FlowVariables/internals/AppsTabContent'
import FlowTabContent from '@features/FlowVariables/internals/FlowTabContent'
import MathTabContent from '@features/FlowVariables/internals/MathTabContent'
import StringTabContent from '@features/FlowVariables/internals/StringTabContent'
import SystemTabContent from '@features/FlowVariables/internals/SystemTabContent'
import LucideIcn from '@icons/LucideIcn'
import Tabs, { TabPanel } from '@utilities/Tabs'
import { Flex, Popover, Typography } from 'antd'

const tabItems = [
  {
    label: (
      <Flex vertical align="center" css={{ paddingBlockStart: 2 }}>
        <Typography.Text>
          <LucideIcn name="globe" />
        </Typography.Text>
        <Typography.Text>Apps</Typography.Text>
      </Flex>
    ),
    value: 'apps'
  },
  {
    label: (
      <Flex vertical align="center" css={{ paddingBlockStart: 2 }}>
        <Typography.Text>
          <LucideIcn name="box" />
        </Typography.Text>
        <Typography.Text>Flow</Typography.Text>
      </Flex>
    ),
    value: 'flow'
  },
  {
    label: (
      <Flex vertical align="center" css={{ paddingBlockStart: 2 }}>
        <Typography.Text>
          <LucideIcn name="calculator" />
        </Typography.Text>
        <Typography.Text>Math</Typography.Text>
      </Flex>
    ),
    value: 'math'
  },
  {
    label: (
      <Flex vertical align="center" css={{ paddingBlockStart: 2 }}>
        <Typography.Text>
          <LucideIcn name="type" />
        </Typography.Text>
        <Typography.Text>String</Typography.Text>
      </Flex>
    ),
    value: 'string'
  },
  {
    label: (
      <Flex vertical align="center" css={{ paddingBlockStart: 2 }}>
        <Typography.Text>
          <LucideIcn name="monitor" />
        </Typography.Text>
        <Typography.Text>System</Typography.Text>
      </Flex>
    ),
    value: 'system'
  }
]

type FlowVariablesType = {
  children: React.ReactNode
  inFocus: boolean
  onClickVar: (value: MixInputValue | MixInputValue[]) => void
  focusMixInput: () => void
}

export default function FlowVariables({
  children,
  inFocus,
  onClickVar,
  focusMixInput
}: FlowVariablesType) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen === false && inFocus === true) {
      setIsOpen(true)
    } else {
      setIsOpen(newOpen)
    }
  }

  return (
    <Popover
      placement="right"
      trigger="click"
      open={isOpen}
      onOpenChange={handleOpenChange}
      content={
        <div css={{ overflow: 'hidden' }}>
          <Tabs onChange={focusMixInput} options={tabItems} block>
            <TabPanel value="apps">
              <AppsTabContent onClickVar={onClickVar} />
            </TabPanel>
            <TabPanel value="flow">
              <FlowTabContent onClickVar={onClickVar} />
            </TabPanel>
            <TabPanel value="math">
              <MathTabContent onClickVar={onClickVar} />
            </TabPanel>
            <TabPanel value="string">
              <StringTabContent onClickVar={onClickVar} />
            </TabPanel>
            <TabPanel value="system">
              <SystemTabContent onClickVar={onClickVar} />
            </TabPanel>
          </Tabs>
        </div>
      }
      overlayStyle={{ width: 400, zIndex: 999999 }}
      overlayInnerStyle={{ maxHeight: '100vh', overflow: 'auto' }}
    >
      <>{children}</>
    </Popover>
  )
}
