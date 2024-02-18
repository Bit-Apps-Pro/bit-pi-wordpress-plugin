import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import uploadFile from './uploadFile.googleDrive.machine'

export default defineFlowMachineRoot({
  appSlug: 'googleDrive',
  machines: [uploadFile]
})
