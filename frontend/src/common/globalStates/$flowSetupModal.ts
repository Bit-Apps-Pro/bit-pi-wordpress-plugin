import { atom } from 'jotai'

interface FlowSetupModalType {
  isOpen: boolean
  type: string
  id: string
  selectedApp?: string
}

const $flowSetupModal = atom<FlowSetupModalType>({
  isOpen: false,
  type: '',
  id: ''
})
export default $flowSetupModal
