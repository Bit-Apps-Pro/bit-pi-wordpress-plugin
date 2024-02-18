import useVariables from '@features/NodeDetailsModal/data/useVariables'
import ConditionIcn from '@icons/ConditionIcn'
import EditIcon from '@icons/EditIcon'
import { Col, Row, Typography, theme } from 'antd'

import css from './ConditionItem.module.css'
import ConditionItemModalWrapper from './ConditionItemModalWrapper'
import Conditional from './Conditional'

type ConditionItemModalType = {
  title: string
  nodeId: string
  conditionId: string
  handleTitleChange: (value: string) => void
  closeConditionModal: () => void
}

export default function ConditionItemModal({
  title,
  nodeId,
  conditionId,
  handleTitleChange,
  closeConditionModal
}: ConditionItemModalType) {
  const { token } = theme.useToken()
  useVariables()

  return (
    <ConditionItemModalWrapper onClose={closeConditionModal}>
      <Row gutter={15}>
        <Col flex="none">
          <div
            className={css.cardHeaderIcon}
            css={{
              borderRadius: token.borderRadius,
              backgroundColor: token.colorBgContainerDisabled,
              border: `1px solid ${token.colorBorderSecondary}`
            }}
          >
            <ConditionIcn size="2.5rem" stroke={1} />
          </div>
        </Col>
        <Col flex="auto">
          <Typography.Title
            level={5}
            editable={{
              onChange: handleTitleChange,
              triggerType: ['icon', 'text'],
              icon: <EditIcon css={{ color: token.colorText }} />
            }}
          >
            {title}
          </Typography.Title>
          <Typography.Text type="secondary">Conditional Logic</Typography.Text>
        </Col>
      </Row>

      <Conditional conditionId={conditionId} nodeId={nodeId} />
    </ConditionItemModalWrapper>
  )
}
