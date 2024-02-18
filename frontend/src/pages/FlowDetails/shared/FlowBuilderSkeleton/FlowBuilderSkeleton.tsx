import css from './FlowBuilderSkeleton.module.css'

export default function FlowBuilderSkeleton() {
  return (
    <div className={css.flowBuilderSkeletonWrap}>
      <div className={css.flowBuilderLefsideSkeleton}>
        <div className={`${css.item} loader`} />
        <div className={`${css.item} loader`} />
        <div className={`${css.apps} loader`} />
      </div>
      <div className={css.flowBuilderSkeleton}>
        <div className={css.builderHeader}>
          <div className={`${css.builderButton} loader`} />
          <div className={`${css.builderButton} loader`} />
        </div>
        <div className={`${css.builder} loader`} />
      </div>
    </div>
  )
}
