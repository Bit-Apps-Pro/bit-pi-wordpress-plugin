import { type DependencyList } from 'react'
import { useRef } from 'react'
import { useDebounce } from 'react-use'

import { isObjectEqual } from '@common/helpers/globalHelpers'

function compareDeps(deps: DependencyList, oldDeps: DependencyList) {
  return deps.every((dep, index) => {
    const prevDep = oldDeps[index]

    if (
      (Array.isArray(dep) && Array.isArray(prevDep)) ||
      (typeof dep === 'object' && typeof prevDep === 'object')
    ) {
      return isObjectEqual(dep, prevDep)
    }

    return dep === prevDep
  })
}

export default function useMemoDebounce(callback: () => void, delay: number, deps: DependencyList) {
  const depsRef = useRef(deps)

  useDebounce(
    () => {
      const isDepsAreEqual = compareDeps(deps, depsRef.current)

      if (!isDepsAreEqual) {
        callback()
        depsRef.current = deps
      }
    },
    delay,
    deps
  )
}
