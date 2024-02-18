import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import LucideIcn from '@icons/LucideIcn'
import MixInput from '@utilities/MixInput'
import { Button, Col, Row, Select, Space } from 'antd'
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { v4 as uuidv4 } from 'uuid'

import { type ConditionType, type ConditionalPropsType, type LogicOperatorType } from './ConditionalType'

const operators = [
  {
    label: 'Basic operators',
    options: [
      { label: 'Exist', value: 'basic:exist' },
      { label: 'Does not exist', value: 'basic:not-exist' }
    ]
  },
  {
    label: 'Text operators',
    options: [
      { label: 'Equal to', value: 'text:equal' },
      { label: 'Equal to (case insensitive)', value: 'text:equal-ci' },
      { label: 'Not equal to', value: 'text:not-equal' },
      { label: 'Not equal to (case insensitive)', value: 'text:not-equal-ci' },
      { label: 'Contains', value: 'text:contains' },
      { label: 'Contains (case insensitive)', value: 'text:contains-ci' },
      { label: 'Does not contain', value: 'text:not-contain' },
      { label: 'Does not contain (case insensitive)', value: 'text:not-contain-ci' },
      { label: 'Starts with', value: 'text:starts-with' },
      { label: 'Starts with (case insensitive)', value: 'text:starts-with-ci' },
      { label: 'Does not start with', value: 'text:not-start-with' },
      { label: 'Does not start with (case insensitive)', value: 'text:not-start-with-ci' },
      { label: 'Ends with', value: 'text:ends-with' },
      { label: 'Ends with (case insensitive)', value: 'text:ends-with-ci' },
      { label: 'Does not end with', value: 'text:not-end-with' },
      { label: 'Does not end with (case insensitive)', value: 'text:not-end-with-ci' },
      { label: 'Matches pattern', value: 'text:matches-pattern' },
      { label: 'Matches pattern (case insensitive)', value: 'text:matches-pattern-ci' },
      { label: 'Does not match pattern', value: 'text:not-match-pattern' },
      { label: 'Does not match pattern (case insensitive)', value: 'text:not-match-pattern-ci' }
    ]
  },
  {
    label: 'Numeric operators',
    options: [
      { label: 'Equal to', value: 'numeric:equal' },
      { label: 'Not equal to', value: 'numeric:not-equal' },
      { label: 'Greater than', value: 'numeric:greater' },
      { label: 'Less than', value: 'numeric:less' },
      { label: 'Greater than or equal to', value: 'numeric:greater-equal' },
      { label: 'Less than or equal to', value: 'numeric:less-equal' }
    ]
  },
  {
    label: 'Datetime operators',
    options: [
      { label: 'Equal to', value: 'datetime:equal' },
      { label: 'Not equal to', value: 'datetime:not-equal' },
      { label: 'Later than', value: 'datetime:later' },
      { label: 'Earlier than', value: 'datetime:earlier' },
      { label: 'Later than or equal to', value: 'datetime:later-equal' },
      { label: 'Earlier than or equal to', value: 'datetime:earlier-equal' }
    ]
  },
  {
    label: 'Time operators',
    options: [
      { label: 'Equal to', value: 'time:equal' },
      { label: 'Not equal to', value: 'time:not-equal' },
      { label: 'Greater than', value: 'time:greater' },
      { label: 'Less than', value: 'time:less' },
      { label: 'Greater than or equal to', value: 'time:greater-equal' },
      { label: 'Less than or equal to', value: 'time:less-equal' }
    ]
  },
  {
    label: 'Boolean operators',
    options: [
      { label: 'Equal to', value: 'boolean:equal' },
      { label: 'Not equal to', value: 'boolean:not-equal' }
    ]
  },
  {
    label: 'Array operators',
    options: [
      { label: 'Contains', value: 'array:contains' },
      { label: 'Contains (case insensitive)', value: 'array:contains-ci' },
      { label: 'Does not contains', value: 'array:not-contains' },
      { label: 'Does not contains (case insensitive)', value: 'array:not-contains-ci' },
      { label: 'Array length equal to', value: 'array:length-equal' },
      { label: 'Array length not equal to', value: 'array:length-not-equal' },
      { label: 'Array length greater than', value: 'array:length-greater' },
      { label: 'Array length less than', value: 'array:length-less' },
      { label: 'Array length greater than or equal to', value: 'array:length-greater-equal' },
      { label: 'Array length less than or equal to', value: 'array:length-less-equal' }
    ]
  }
]

const LogicalOperator = [
  { label: 'And', value: 'and' },
  { label: 'Or', value: 'or' }
]

const newLogicOperator: LogicOperatorType = {
  type: 'logical-operator',
  value: 'and'
}

const newCondition: ConditionType = {
  type: 'logic',
  leftExp: [],
  operator: 'text:equal',
  rightExp: []
}

export const defaultConditions = [{ id: uuidv4(), ...newCondition }]

export default function Conditional({ conditionId, nodeId }: ConditionalPropsType) {
  const [flowNode, setFlowNode] = useAtom($flowNodesFamily(nodeId))

  const getConditions = () => {
    const selectedItem = flowNode?.states?.conditions?.find(item => item.id === conditionId)

    if (!selectedItem || selectedItem.type === NodeTypeDef.defaultConditionLogic) {
      return []
    }

    return selectedItem.condition
  }

  const handleInputChanges = (value: string | MappedValueType[], index: number, name: string) => {
    setFlowNode(prev =>
      create(prev, draft => {
        const selectedItem = draft.states?.conditions?.find(item => item.id === conditionId)
        if (!selectedItem || selectedItem.type === NodeTypeDef.defaultConditionLogic) return

        const condition = selectedItem.condition[index]

        if (condition.type === 'logical-operator') {
          condition.value = value as string
        } else if (name === 'leftExp') {
          condition.leftExp = value as MappedValueType[]
        } else if (name === 'operator') {
          condition.operator = value as string
        } else if (name === 'rightExp') {
          condition.rightExp = value as MappedValueType[]
        }
      })
    )
  }

  const addCondition = (index: number) => () => {
    setFlowNode(prev =>
      create(prev, draft => {
        const selectedItem = draft.states?.conditions?.find(item => item.id === conditionId)
        if (!selectedItem || selectedItem.type === NodeTypeDef.defaultConditionLogic) return

        selectedItem.condition.splice(
          index + 1,
          0,
          { id: uuidv4(), ...newLogicOperator },
          { id: uuidv4(), ...newCondition }
        )
      })
    )
  }

  const deleteCondition = (index: number) => () => {
    setFlowNode(prev =>
      create(prev, draft => {
        const selectedItem = draft.states?.conditions?.find(item => item.id === conditionId)
        if (!selectedItem || selectedItem.type === NodeTypeDef.defaultConditionLogic) return

        selectedItem.condition.splice(index - 1, 2)
      })
    )
  }

  return (
    <div className="mt-3">
      {getConditions().map((condition, index) => (
        <div key={condition.id}>
          {condition.type === 'logical-operator' && (
            <Select
              value={condition.value}
              options={LogicalOperator}
              css={{ margin: '6px 0 !important' }}
              onChange={val => handleInputChanges(val, index, 'logicalOperator')}
            />
          )}

          {condition.type === 'logic' && (
            <Row gutter={6} align="middle">
              <Col flex="1 1 200px">
                <MixInput
                  onChange={val => handleInputChanges(val, index, 'leftExp')}
                  value={condition.leftExp}
                />
              </Col>
              <Col flex="150px">
                <Select
                  showSearch
                  options={operators}
                  value={condition.operator}
                  onChange={val => handleInputChanges(val, index, 'operator')}
                  style={{ width: 150 }}
                  dropdownStyle={{ width: 300 }}
                />
              </Col>
              <Col flex="1 1 200px">
                <MixInput
                  onChange={val => handleInputChanges(val, index, 'rightExp')}
                  value={condition.rightExp}
                />
              </Col>
              <Col flex="0 1 auto">
                <Space size={6}>
                  <Button
                    shape="circle"
                    icon={<LucideIcn name="plus" />}
                    onClick={addCondition(index)}
                  />
                  {index !== 0 ? (
                    <Button
                      danger
                      shape="circle"
                      icon={<LucideIcn name="trash-2" />}
                      onClick={deleteCondition(index)}
                    />
                  ) : (
                    <Button css={{ visibility: 'hidden' }} />
                  )}
                </Space>
              </Col>
            </Row>
          )}
        </div>
      ))}
    </div>
  )
}
