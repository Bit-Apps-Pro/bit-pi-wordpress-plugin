import FlowLoaderSkeleton from '@pages/Flows/shared/FlowLoaderSkeleton/FlowLoaderSkeleton'

import css from './FlowPageLoaderSkeleton.module.css'

export default function FlowPageLoaderSkeleton() {
  return (
    <div className={css.FlowPageLoaderSkeleton}>
      <div className={css.FlowLoaderSkeletonHeader}>
        <div className={`${css.FlowLoaderSkeletonTitle} loader`} />
        <div className={`${css.FlowLoaderSkeletonSearch} loader`} />
      </div>
      <FlowLoaderSkeleton flowQuantity={15} />
    </div>
  )
}
