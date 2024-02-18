import { atom } from 'jotai'

import { type FlowMachineRootType, type ImportedMachinesType } from './FlowMachineType'

/**
 * When drag or select an app from list then all of machines has been fetched from server and stored in this atom
 */
const $importedMachines = atom<ImportedMachinesType>(new Map<string, FlowMachineRootType>())

export default $importedMachines
