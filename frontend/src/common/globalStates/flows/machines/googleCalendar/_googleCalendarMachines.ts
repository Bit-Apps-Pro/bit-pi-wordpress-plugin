import { defineFlowMachineRoot } from '@common/helpers/defineFlowMachine'

import createEvent from './createEvent.googleCalendar.machine'

export default defineFlowMachineRoot({
  appSlug: 'googleCalendar',
  machines: [createEvent]
})
