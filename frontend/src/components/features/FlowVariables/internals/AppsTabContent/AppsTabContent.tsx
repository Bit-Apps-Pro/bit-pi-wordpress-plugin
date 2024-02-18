import { type MixInputValue } from 'react-mix-tag-input'

import { $appConfig, $flowSetupModal } from '@common/globalStates'
import $flowDetailsSelector from '@common/globalStates/$flowDetails'
import $flowNodes, { type FlowNodeType } from '@common/globalStates/$flowNodes'
import { type VarType } from '@common/globalStates/flows/variables/FlowVariablesType'
import { extractNodeId, getPrevConnectedNodeIds } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import VarDataTypes from '@features/FlowVariables/VarDataTypes'
import If from '@utilities/If'
import {
  Button,
  Collapse,
  type CollapseProps,
  Flex,
  type GlobalToken,
  Space,
  Tree,
  Typography,
  theme
} from 'antd'
import { type DataNode } from 'antd/es/tree'
import { useAtomValue } from 'jotai'

import appsTabContentStyle from './AppsTabContentStyle'

type TabContentType = {
  onClickVar: (value: MixInputValue) => void
}

type HandleClickVarType = (nodeId: string, label: string, path: string, dType: string) => () => void

const getTreeData = (
  nodeId: string,
  nodeVars: VarType[],
  handleClickVar: HandleClickVarType,
  appColor?: string
) =>
  nodeVars.map(item => {
    const { token } = theme.useToken()
    const { path, label, dType, value } = item

    const singleTree: DataNode = {
      key: nodeId + path,
      style: { maxWidth: '100%' },
      title: (
        <Flex gap={10} css={{ marginRight: 15 }}>
          <Button
            size="small"
            css={appsTabContentStyle(token).treeButton(appColor)}
            onClick={handleClickVar(nodeId, `${extractNodeId(nodeId)}. ${label}`, path, dType)}
          >
            {label} {dType === VarDataTypes.ARRAY && '[]'}
          </Button>

          <If conditions={[dType !== VarDataTypes.ARRAY && dType !== VarDataTypes.COLLECTION]}>
            <Typography.Text type="secondary" ellipsis>
              {value}
            </Typography.Text>
          </If>
        </Flex>
      )
    }

    if (dType === VarDataTypes.ARRAY || dType === VarDataTypes.COLLECTION) {
      singleTree.children = getTreeData(nodeId, value, handleClickVar, appColor)
    }

    return singleTree
  })

const collapseItems = (
  filteredVariables: [string, FlowNodeType][],
  handleClickVar: HandleClickVarType,
  token: GlobalToken,
  isDarkTheme: boolean
): CollapseProps['items'] =>
  filteredVariables.map(([nodeId, node]) => {
    const treeData = getTreeData(nodeId, node.variables || [], handleClickVar, node?.appColor)

    return {
      key: nodeId,
      label: (
        <Space>
          {node.appTitle}
          <span css={appsTabContentStyle(token).nodeIdBadge(isDarkTheme)}>{extractNodeId(nodeId)}</span>
        </Space>
      ),
      children: (
        <Tree
          showLine
          selectable={false}
          treeData={treeData}
          rootStyle={{ backgroundColor: 'transparent' }}
          rootClassName="variable-tree"
        />
      )
    }
  })

export default function AppsTabContent({ onClickVar }: TabContentType) {
  const nodeVariables = useAtomValue($flowNodes)
  const { token } = theme.useToken()
  const { isDarkTheme } = useAtomValue($appConfig)
  const { id: selectedNodeId } = useAtomValue($flowSetupModal)
  const { map: flowTree } = useAtomValue($flowDetailsSelector)

  if (!selectedNodeId) return null

  const prevConnectedNodeIds = getPrevConnectedNodeIds(selectedNodeId, flowTree)
  const filteredVariables = Object.entries(nodeVariables).filter(
    ([nodeId, { variables }]) =>
      nodeId !== selectedNodeId &&
      Array.isArray(variables) &&
      variables.length > 0 &&
      prevConnectedNodeIds.split(',').includes(nodeId)
  )

  const handleClickVar = (nodeId: string, label: string, path: string, dType: string) => () => {
    onClickVar({ type: 'tag', label, data: { tagType: 'variable', nodeId, path, dType } })
  }

  return (
    <Collapse
      ghost
      size="small"
      items={collapseItems(filteredVariables, handleClickVar, token, isDarkTheme)}
      defaultActiveKey={Object.keys(nodeVariables)}
    />
  )
}
