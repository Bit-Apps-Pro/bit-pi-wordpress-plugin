import { type MutationFunction, type MutationKey } from '@tanstack/react-query'

type MutationType = {
  mutationFn: MutationFunction
  mutationKey: MutationKey
}
export default MutationType
