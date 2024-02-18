import $flowNodes from '@common/globalStates/$flowNodes'
import { dispatchMachineEvent, importMachine } from '@common/helpers/flowMachineUtils'
import { atom } from 'jotai'
import { type Getter, type Setter } from 'jotai'

import { type SetterAction } from './FlowMachineType'

const $flowMachineSelector = atom(
  get => get($flowNodes),
  async (_get: Getter, _set: Setter, action: SetterAction) => {
    const { actionType, data } = action

    switch (actionType) {
      case 'IMPORT_MACHINE':
        await importMachine({ data })
        break
      case 'DELETE_MACHINE':
        // TODO delete machine
        break
      default:
        await dispatchMachineEvent({ data, actionType })
        break
    }
  }
)

export default $flowMachineSelector
