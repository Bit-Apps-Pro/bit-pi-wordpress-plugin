import { type ComponentType } from 'react'
import { type Edge, type Node, useEdges, useReactFlow } from 'reactflow'

import $flowDetailsSelector, { type FlowType } from '@common/globalStates/$flowDetails'
import $flowNodes from '@common/globalStates/$flowNodes'
import $importedMachines from '@common/globalStates/flows/$importedMachines'
import useDeleteNode from '@pages/FlowDetails/data/useDeleteNode'
import { useSetAtom } from 'jotai'
import { create } from 'mutative'

function withNodeDelete<T extends object>(Component: ComponentType<T>) {
  // eslint-disable-next-line func-names
  return function ({ ...props }) {
    const setImportedMachine = useSetAtom($importedMachines)
    const setFlowNodes = useSetAtom($flowNodes)
    const setFlowDetails = useSetAtom($flowDetailsSelector)
    const reactFlow = useReactFlow()
    const edges = useEdges()
    const { deleteNode: deleteNodeWithId } = useDeleteNode()

    const deleteNode = async (id: string) => {
      const { status } = await deleteNodeWithId(id)
      if (status === 'error') return console.error("Mismatch node info, can't delete this node")

      setImportedMachine(prev =>
        create(prev, draft => {
          draft.delete(id)
        })
      )

      setFlowNodes(prev =>
        create(prev, draft => {
          delete draft[id]
        })
      )

      reactFlow.setNodes((nods: Node[]) =>
        create(nods, draft => {
          const deleteTargetNode = draft.filter(node => node.id !== id)
          return deleteTargetNode
        })
      )

      const [draftedEdges, finalize] = create(edges)

      const isNodeConnectedWithEdge = edges.find(edge => edge.source === id || edge.target === id)

      // if node connected with any edge then do below
      if (isNodeConnectedWithEdge) {
        const isNodeHasSourceEdge = draftedEdges.find(edge => edge.source === id)
        const isNodeHasTargetEdge = draftedEdges.find(edge => edge.target === id)

        // isNodeHasBothSourceAndTargetEdge then delete source edge
        if (isNodeHasSourceEdge && isNodeHasTargetEdge) {
          draftedEdges.find((edge: Edge, index: number) => {
            if (edge.target === id) {
              draftedEdges[index].target = isNodeHasSourceEdge.target
            }
          })

          const needToDeleteEdgeIndex = draftedEdges.findIndex(edge => edge.source === id)
          draftedEdges.splice(needToDeleteEdgeIndex, 1)
        }

        // isNodeHasOnlySourceEdge then delete edge by source
        if (isNodeHasSourceEdge && !isNodeHasTargetEdge) {
          draftedEdges.map((edge, index) => edge.source === id && draftedEdges.splice(index, 1))
        }

        // isNodeHasOnlyTargetEdge thene delete edge by target
        if (isNodeHasTargetEdge && !isNodeHasSourceEdge) {
          draftedEdges.map((edge, index) => edge.target === id && draftedEdges.splice(index, 1))
        }
      }

      const updatedEdges = finalize()
      reactFlow.setEdges(updatedEdges)

      setFlowDetails((prevFlow: FlowType) =>
        create(prevFlow, draftFlow => {
          const deleteTargetNode = draftFlow.data.nodes.filter((node: Node) => node.id !== id)
          draftFlow.data.nodes = deleteTargetNode // eslint-disable-line no-param-reassign
          draftFlow.data.edges = updatedEdges // eslint-disable-line no-param-reassign

          return draftFlow
        })
      )
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component deleteNode={deleteNode} {...(props as T)} />
  }
}

export default withNodeDelete
