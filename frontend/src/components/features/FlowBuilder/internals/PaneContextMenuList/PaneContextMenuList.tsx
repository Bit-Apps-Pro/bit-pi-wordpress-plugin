import PaneContextMenuItem from '@components/features/FlowBuilder/internals/PaneContextMenuItem'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import cls from './PaneContextMenuList.module.css'
import './simplebar.css'

// Animation Framer Motion
// const appsVariant = {
//   hidden: {
//     opacity: 0
//   },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.1,
//       when: 'beforeChildren',
//       staggerChildren: 0.1
//     }
//   }
// }

// Data Type
export interface PaneContextMenuListPropsTypes {
  iconURL: string
  title: string
}

export default function PaneContextMenuList({
  paneContextMenuList
}: {
  paneContextMenuList: PaneContextMenuListPropsTypes[]
}): JSX.Element {
  return (
    <SimpleBar style={{ maxHeight: 210 }}>
      <ul role="menu" className={cls.flowAppList}>
        {paneContextMenuList.map((menuItem: PaneContextMenuListPropsTypes, i: number) => (
          <PaneContextMenuItem key={`flowApp-${i * 4}`} menuItem={menuItem} />
        ))}
      </ul>
    </SimpleBar>
  )
}
