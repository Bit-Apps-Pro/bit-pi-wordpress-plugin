import css from './FlowLoaderSkeleton.module.css'

interface FlowLoaderSkeletonType {
  flowQuantity: number
}

export default function FlowLoaderSkeleton({ flowQuantity }: FlowLoaderSkeletonType) {
  return (
    <div className={css.flowLoaderSection}>
      {Array(flowQuantity)
        .fill(0)
        .map((_, index) => (
          <div key={`loader-${index * 2}`} className={`${css.flowLoader} loader`} />
        ))}
    </div>
  )
}
