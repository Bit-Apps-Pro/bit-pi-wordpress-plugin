import { type Edge, type Node } from 'reactflow'
import { Position } from 'reactflow'

import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { createFlowMap } from './FlowBuilderHelper'

const edges: Edge[] = [
  {
    source: '82-1',
    sourceHandle: 'right',
    target: '82-2',
    targetHandle: Position.Left,
    id: 'edge-1',
    className: 'edge'
  },
  {
    source: '82-2',
    sourceHandle: 'right',
    target: '82-3',
    targetHandle: Position.Left,
    id: 'edge-2',
    className: 'edge'
  },
  {
    source: '82-3',
    sourceHandle: '82-3-1',
    target: '82-4',
    targetHandle: Position.Left,
    id: 'edge-3',
    className: 'edge'
  },
  {
    source: '82-3',
    sourceHandle: '82-3-2',
    target: '82-5',
    targetHandle: Position.Left,
    id: 'edge-4',
    className: 'edge'
  },
  {
    source: '82-5',
    sourceHandle: 'right',
    target: '82-6',
    targetHandle: Position.Left,
    id: 'edge-5',
    className: 'edge'
  },
  {
    source: '82-3',
    sourceHandle: '82-3-3',
    target: '82-7',
    targetHandle: Position.Left,
    id: 'edge-6',
    className: 'edge'
  },
  {
    source: '82-7',
    sourceHandle: 'right',
    target: '82-8',
    targetHandle: Position.Left,
    id: 'edge-7',
    className: 'edge'
  },
  {
    source: '82-7',
    sourceHandle: 'right',
    target: '82-9',
    targetHandle: Position.Left,
    id: 'edge-8',
    className: 'edge'
  },
  {
    source: '82-8',
    sourceHandle: 'right',
    target: '82-10',
    targetHandle: Position.Left,
    id: 'edge-9',
    className: 'edge'
  },
  {
    source: '82-3',
    sourceHandle: '82-3-0',
    target: '82-11',
    targetHandle: Position.Left,
    id: 'edge-10',
    className: 'edge'
  },
  {
    source: '82-11',
    sourceHandle: '82-11-1',
    target: '82-12',
    targetHandle: Position.Left,
    id: 'edge-11',
    className: 'edge'
  },
  {
    source: '82-13',
    sourceHandle: 'right',
    target: '82-14',
    targetHandle: Position.Left,
    id: 'edge-12',
    className: 'edge'
  },
  {
    source: '82-11',
    sourceHandle: '82-11-2',
    target: '82-13',
    targetHandle: Position.Left,
    id: 'edge-13',
    className: 'edge'
  },
  {
    source: '82-11',
    sourceHandle: '82-11-3',
    target: '82-15',
    targetHandle: Position.Left,
    id: 'edge-14',
    className: 'edge'
  },
  {
    source: '82-15',
    sourceHandle: 'right',
    target: '82-16',
    targetHandle: Position.Left,
    id: 'edge-15',
    className: 'edge'
  },
  {
    source: '82-15',
    sourceHandle: 'right',
    target: '82-17',
    targetHandle: Position.Left,
    id: 'edge-16',
    className: 'edge'
  },
  {
    source: '82-17',
    sourceHandle: '82-17-0',
    target: '82-18',
    targetHandle: Position.Left,
    id: 'edge-17',
    className: 'edge'
  },
  {
    source: '82-11',
    sourceHandle: '82-11-0',
    target: '82-19',
    targetHandle: Position.Left,
    id: 'edge-18',
    className: 'edge'
  }
]

const nodes: Node[] = [
  {
    width: 240,
    height: 70,
    connectable: true,
    data: [],
    id: '82-1',
    position: {
      x: 117,
      y: 110
    },
    positionAbsolute: {
      x: 117,
      y: 110
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: NodeTypeDef.trigger,
    selected: false
  },
  {
    width: 240,
    height: 70,
    id: '82-2',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 443,
      y: 126
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    positionAbsolute: {
      x: 443,
      y: 126
    },
    selected: false
  },
  {
    width: 240,
    height: 285,
    id: '82-3',
    type: NodeTypeDef.condition,
    data: {
      title: 'Untitled',
      conditions: [
        {
          id: '82-3-0',
          title: 'Default Condition',
          type: NodeTypeDef.defaultConditionLogic
        },
        {
          id: '82-3-1',
          title: 'Untitled Condition 1',
          type: NodeTypeDef.conditionLogic
        },
        {
          id: '82-3-2',
          title: 'Untitled Condition 2',
          type: NodeTypeDef.conditionLogic
        },
        {
          id: '82-3-3',
          title: 'Untitled Condition 3',
          type: NodeTypeDef.conditionLogic
        }
      ]
    },
    connectable: true,
    position: {
      x: 764,
      y: 124
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selected: false,
    positionAbsolute: {
      x: 764,
      y: 124
    },
    dragging: false
  },
  {
    width: 240,
    height: 70,
    id: '82-4',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1114,
      y: 66
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selected: false,
    positionAbsolute: {
      x: 1114,
      y: 66
    },
    dragging: false
  },
  {
    width: 240,
    height: 70,
    id: '82-5',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1135,
      y: 173
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    positionAbsolute: {
      x: 1135,
      y: 173
    },
    selected: false
  },
  {
    width: 240,
    height: 70,
    id: '82-6',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1465,
      y: 172
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selected: false,
    positionAbsolute: {
      x: 1465,
      y: 172
    },
    dragging: false
  },
  {
    width: 75,
    height: 75,
    id: '82-7',
    type: NodeTypeDef.router,
    data: {},
    connectable: true,
    position: {
      x: 1104,
      y: 312
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    positionAbsolute: {
      x: 1104,
      y: 312
    },
    selected: false,
    dragging: false
  },
  {
    width: 240,
    height: 70,
    id: '82-8',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1254,
      y: 262
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selected: false,
    positionAbsolute: {
      x: 1254,
      y: 262
    }
  },
  {
    width: 240,
    height: 70,
    id: '82-9',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1263,
      y: 386
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    positionAbsolute: {
      x: 1263,
      y: 386
    },
    selected: false
  },
  {
    width: 240,
    height: 70,
    id: '82-10',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1586,
      y: 262
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selected: false,
    positionAbsolute: {
      x: 1586,
      y: 262
    },
    dragging: false
  },
  {
    width: 240,
    height: 248,
    id: '82-11',
    type: NodeTypeDef.condition,
    data: {
      title: 'Untitled',
      conditions: [
        {
          id: '82-11-0',
          title: 'Default Condition',
          type: NodeTypeDef.defaultConditionLogic
        },
        {
          id: '82-11-1',
          title: 'Untitled Condition 1',
          type: NodeTypeDef.conditionLogic
        },
        {
          id: '82-11-2',
          title: 'Untitled Condition 2',
          type: NodeTypeDef.conditionLogic
        },
        {
          id: '82-11-3',
          title: 'Untitled Condition 3',
          type: NodeTypeDef.conditionLogic
        }
      ]
    },
    connectable: true,
    position: {
      x: 1069,
      y: 482
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selected: false,
    dragging: false,
    positionAbsolute: {
      x: 1069,
      y: 482
    }
  },
  {
    width: 240,
    height: 70,
    id: '82-12',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1380,
      y: 496
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    selected: false,
    positionAbsolute: {
      x: 1380,
      y: 496
    },
    dragging: false
  },
  {
    id: '82-13',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1382,
      y: 597
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: '82-14',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1725,
      y: 608
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: '82-15',
    type: NodeTypeDef.router,
    data: {},
    connectable: true,
    position: {
      x: 1396,
      y: 695
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: '82-16',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1543,
      y: 692
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    positionAbsolute: {
      x: 1543,
      y: 692
    }
  },
  {
    id: '82-17',
    type: NodeTypeDef.condition,
    data: {
      title: 'Untitled',
      conditions: [
        {
          id: '82-17-0',
          title: 'Default Condition',
          type: NodeTypeDef.defaultConditionLogic
        }
      ]
    },
    connectable: true,
    position: {
      x: 1554,
      y: 795
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: '82-18',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1852,
      y: 896
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: '82-19',
    type: NodeTypeDef.action,
    data: {},
    connectable: true,
    position: {
      x: 1570,
      y: 1008
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    positionAbsolute: {
      x: 1570,
      y: 1008
    }
  }
]

const normalizeObj = `
{
  "id": "82-1",
  "next": {
    "id": "82-2",
    "next": {
      "conditionIds": [
        "82-3-1",
        "82-3-2",
        "82-3-3",
        "82-3-0",
      ],
      "id": "82-3",
      "next": [
        {
          "id": "82-3-1",
          "next": {
            "id": "82-4",
            "previous": "82-3-1",
            "type": "action",
          },
          "previous": "82-3",
          "type": "condition-logic",
        },
        {
          "id": "82-3-2",
          "next": {
            "id": "82-5",
            "next": {
              "id": "82-6",
              "previous": "82-5",
              "type": "action",
            },
            "previous": "82-3-2",
            "type": "action",
          },
          "previous": "82-3",
          "type": "condition-logic",
        },
        {
          "id": "82-3-3",
          "next": {
            "id": "82-7",
            "next": [
              {
                "id": "82-8",
                "next": {
                  "id": "82-10",
                  "previous": "82-8",
                  "type": "action",
                },
                "previous": "82-7",
                "type": "action",
              },
              {
                "id": "82-9",
                "previous": "82-7",
                "type": "action",
              },
            ],
            "previous": "82-3-3",
            "type": "router",
          },
          "previous": "82-3",
          "type": "condition-logic",
        },
        {
          "id": "82-3-0",
          "next": {
            "conditionIds": [
              "82-11-1",
              "82-11-2",
              "82-11-3",
              "82-11-0",
            ],
            "id": "82-11",
            "next": [
              {
                "id": "82-11-1",
                "next": {
                  "id": "82-12",
                  "previous": "82-11-1",
                  "type": "action",
                },
                "previous": "82-11",
                "type": "condition-logic",
              },
              {
                "id": "82-11-2",
                "next": {
                  "id": "82-13",
                  "next": {
                    "id": "82-14",
                    "previous": "82-13",
                    "type": "action",
                  },
                  "previous": "82-11-2",
                  "type": "action",
                },
                "previous": "82-11",
                "type": "condition-logic",
              },
              {
                "id": "82-11-3",
                "next": {
                  "id": "82-15",
                  "next": [
                    {
                      "id": "82-16",
                      "previous": "82-15",
                      "type": "action",
                    },
                    {
                      "conditionIds": [
                        "82-17-0",
                      ],
                      "id": "82-17",
                      "next": [
                        {
                          "id": "82-17-0",
                          "next": {
                            "id": "82-18",
                            "previous": "82-17-0",
                            "type": "action",
                          },
                          "previous": "82-17",
                          "type": "default-condition-logic",
                        },
                      ],
                      "previous": "82-15",
                      "type": "condition",
                    },
                  ],
                  "previous": "82-11-3",
                  "type": "router",
                },
                "previous": "82-11",
                "type": "condition-logic",
              },
              {
                "id": "82-11-0",
                "next": {
                  "id": "82-19",
                  "previous": "82-11-0",
                  "type": "action",
                },
                "previous": "82-11",
                "type": "default-condition-logic",
              },
            ],
            "previous": "82-3-0",
            "type": "condition",
          },
          "previous": "82-3",
          "type": "default-condition-logic",
        },
      ],
      "previous": "82-2",
      "type": "condition",
    },
    "previous": "82-1",
    "type": "action",
  },
  "previous": null,
  "type": "trigger",
}
`

describe('test CreateNormalize flow object function', () => {
  afterEach(cleanup)

  it('Single Node to Node', () => {
    const singleEdges: Edge[] = [
      {
        source: '82-1',
        sourceHandle: 'right',
        target: '82-2',
        targetHandle: Position.Left,
        id: 'edge-1',
        className: 'edge'
      }
    ]

    const twoNode: Node[] = [
      {
        data: [],
        id: '82-1',
        position: {
          x: 117,
          y: 110
        },
        type: NodeTypeDef.trigger
      },
      {
        id: '82-2',
        type: NodeTypeDef.action,
        data: {},
        position: {
          x: 443,
          y: 126
        }
      }
    ]

    const result = createFlowMap({
      flowMap: { id: '', type: '', previous: null },
      currentEdge: singleEdges[0],
      nodes: twoNode,
      edges: singleEdges
    })
    expect(result.id).eq('82-1')
    expect(result.type).eq(NodeTypeDef.trigger)
    expect(result.previous).eq(null)
    if (!Array.isArray(result.next)) {
      expect(result.next?.id).eq('82-2')
      expect(result.next?.previous).eq('82-1')
      expect(result.next?.type).eq(NodeTypeDef.action)
      expect(result.next?.next).eq(undefined)
    }
  })

  it('A flow with multiple router & condition & node', () => {
    const result = createFlowMap({
      flowMap: { id: '', type: '', previous: null },
      currentEdge: edges[0],
      nodes,
      edges
    })
    expect(result).toMatchInlineSnapshot(normalizeObj)
  })
})
