import { type ReactNode } from 'react'

import { $appConfig } from '@common/globalStates'
import { clsx } from '@common/helpers/globalHelpers'
import { extractNodeId } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import EditIcon from '@icons/EditIcon'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import { Button, Popconfirm, Row, Space, Typography, theme } from 'antd'
import { useAtomValue } from 'jotai'

import cls from './NodeContent.module.css'
import nodeContentStyle from './nodeContentStyle'

interface NodeContentProps {
  title: string
  subTitle?: string
  icon?: ReactNode
  color?: string
  triggerNode?: boolean
  badgeText: string
  onEditClick: () => void
  onDeleteClick?: () => void
}

export default function NodeContent({
  icon,
  color,
  title,
  subTitle,
  badgeText,
  triggerNode,
  onEditClick,
  onDeleteClick
}: NodeContentProps) {
  const { token } = theme.useToken()
  const { isDarkTheme } = useAtomValue($appConfig)

  return (
    <div className={cls.nodeWrp} data-testid="flow-node" data-node-id={badgeText}>
      <div aria-label="Flow App Item" className={clsx([cls.node, triggerNode && cls.inputNode])}>
        {icon && typeof icon === 'string' ? (
          <img
            src={icon}
            alt={`${title} logo`}
            className={cls.cardContentIcon}
            css={nodeContentStyle(token).nodeImg(color)}
          />
        ) : (
          <Button
            title="Select an app"
            className={cls.cardContentIcon}
            onClick={onEditClick}
            css={nodeContentStyle(token).nodeImg()}
          >
            <LucideIcn name="plus" size={25} />
          </Button>
        )}

        <Space direction="vertical" size={0} className="ml-2">
          <Row align="middle">
            {title ? (
              <Typography.Title
                title={title}
                level={5}
                css={ut({ m: '0*' })}
                className={cls.cardContentTitle}
              >
                {title}
              </Typography.Title>
            ) : (
              <Typography.Text>Select an app</Typography.Text>
            )}
            <span css={nodeContentStyle(token).nodeIdBadge(isDarkTheme)}>
              {extractNodeId(badgeText)}
            </span>
          </Row>

          {subTitle && (
            <Typography.Text title={subTitle} className={cls.cardContentSubTitle}>
              {subTitle}
            </Typography.Text>
          )}
        </Space>

        <Space className={cls.nodeAction}>
          <Button
            data-edit-btn
            aria-label="Edit Flow"
            size="middle"
            onClick={onEditClick}
            icon={<EditIcon size={14} stroke={2} className={cls.cardContentSvg} />}
          />

          {onDeleteClick ? (
            <Popconfirm
              title="Delete the app"
              description="Are you sure to delete this app?"
              icon={<LucideIcn name="trash-2" color="red" />}
              onConfirm={onDeleteClick}
              okText="Yes"
              cancelText="No"
            >
              <Button
                data-edit-btn
                aria-label="Delete Flow"
                size="middle"
                icon={<LucideIcn name="trash-2" size={14} />}
              />
            </Popconfirm>
          ) : null}
        </Space>
      </div>
    </div>
  )
}
