import FlowAppListItem from '@components/features/FlowBuilder/internals/FlowAppListItem'
import { type AppType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { motion } from 'framer-motion'

import cls from './FlowAppList.module.css'

// Animation Framer Motion
const appsVariant = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.01,
      when: 'beforeChildren',
      staggerChildren: 0.06
    }
  }
}

export default function FlowAppList({ apps }: { apps: AppType[] }) {
  return (
    <motion.ul initial="hidden" animate="visible" variants={appsVariant} className={cls.flowAppList}>
      {apps.map((app, i) => (
        <FlowAppListItem key={`flowApp-${i * 4}`} title={app.title} appConfig={app} />
      ))}
    </motion.ul>
  )
}
