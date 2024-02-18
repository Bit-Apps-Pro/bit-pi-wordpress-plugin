import { atom } from 'jotai'

const $paneContextMenu = atom({
  isOpen: false,
  clientX: 0,
  clientY: 0
})
export default $paneContextMenu
