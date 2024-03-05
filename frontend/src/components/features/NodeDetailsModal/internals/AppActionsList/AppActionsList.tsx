import { $flowSetupModal } from '@common/globalStates'
import $flowDetailsSelector from '@common/globalStates/$flowDetails'
import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import $importedMachines from '@common/globalStates/flows/$importedMachines'
import { type FlowMachineRootType } from '@common/globalStates/flows/FlowMachineType'
import { type Interpolation, type Theme, useTheme } from '@emotion/react'
import useConnections from '@features/Connection/data/useConnections'
import { extractNodeId } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import ut from '@resource/utilsCssInJs'
import { Button, Empty, type GlobalToken, List, Typography } from 'antd'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'

const listStyle = ({ token }: { token: GlobalToken }) =>
  ({
    '& .ant-list-header': {
      padding: '0!important',
      border: 'none!important',
      marginBottom: '5px!important',
      position: 'sticky',
      top: 0,
      zIndex: 999,
      background: `${token.colorBgElevated}!important`
    }
  }) as Interpolation<Theme>

export default function AppActionsList({
  setIsMachinePopoverOpen
}: {
  setIsMachinePopoverOpen: (v: boolean) => void
}) {
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const importedMachines = useAtomValue($importedMachines)
  const flowMachinesData: FlowMachineRootType | undefined = importedMachines.get(nodeId)
  const [flowNode, setFlowNode] = useAtom($flowNodesFamily(nodeId))
  const { token } = useTheme()
  useConnections(flowNode?.appSlug, flowNode?.machineSlug)
  const setFlowDetails = useSetAtom($flowDetailsSelector)

  if (!flowMachinesData) {
    return <Empty description="No action/trigger available." />
  }

  const selectAction = (machineSlug: string) => () => {
    const machine = flowMachinesData.machines.find(m => m.machineSlug === machineSlug)
    if (!machine) {
      console.error('machine not found')
      return
    }

    if (machine.machineSlug !== flowNode?.machineSlug) {
      setFlowNode(prv => ({
        ...prv,
        ...machine,
        machineLabel: machine.label
      }))

      // if the node is the first node, then we need to update the trigger type
      if (extractNodeId(nodeId) === 1) {
        setFlowDetails(prev =>
          create(prev, draft => {
            draft.triggerType = machine.triggerType
          })
        )
      }
    }

    setIsMachinePopoverOpen(false)
  }

  const getMachines = () => {
    if (extractNodeId(nodeId) === 1) {
      return flowMachinesData.machines
    }

    return flowMachinesData.machines.filter(machine => machine.runType !== 'trigger')
  }

  return (
    <List
      css={listStyle}
      header={<Typography.Title level={5}>Select Action/Trigger</Typography.Title>}
      itemLayout="vertical"
      dataSource={getMachines()}
      renderItem={machine => (
        <List.Item css={ut({ p: '0*', m: '0 0 2px*', bdr: 'none*' })}>
          <Button
            onClick={selectAction(machine.machineSlug)}
            block
            size="large"
            type="text"
            css={ut({
              ta: 'left*',
              p: '5px*',
              dis: 'flex*',
              jc: 'center',
              dir: 'column',
              h: 'auto*',
              bg: machine.machineSlug === flowNode?.machineSlug && `${token.colorBgTextActive}!important`
            })}
          >
            {machine.label}
            <Typography.Text type="secondary" className="capitalize">
              {machine.runType}
            </Typography.Text>
          </Button>
        </List.Item>
      )}
    />
  )
}
