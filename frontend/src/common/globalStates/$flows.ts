import { type FlowItemType } from '@features/FlowItem/FlowItemType'
import { atom } from 'jotai'

const $flows = atom<FlowItemType[]>([])
export default $flows
