import { atom } from 'jotai'

const $nodeEdgeContextMenu = atom({
  isOpen: false,
  type: '',
  id: '',
  clientX: 0,
  clientY: 0
})
export default $nodeEdgeContextMenu
