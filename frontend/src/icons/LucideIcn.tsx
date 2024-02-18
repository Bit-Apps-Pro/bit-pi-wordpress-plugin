import { type CSSProperties, Suspense, lazy } from 'react'

import { type LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

import AntIconWrapper from './AntIconWrapper'

interface LucideIcnPropsTypes extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports
  color?: string
  size?: number | string
  strokeWidth?: number
  style?: CSSProperties
}

export default function LucideIcn({ name, color, size = '1em', ...rest }: LucideIcnPropsTypes) {
  const isIconNameValid = name in dynamicIconImports
  const iconName = isIconNameValid ? name : 'angry'
  const LucideIcon = lazy(dynamicIconImports[iconName])

  return (
    <AntIconWrapper>
      <Suspense fallback={<div style={{ background: 'transparent', width: size, height: size }} />}>
        <LucideIcon
          color={isIconNameValid ? color : 'red'}
          size={size}
          name={name}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />
      </Suspense>
    </AntIconWrapper>
  )
}
