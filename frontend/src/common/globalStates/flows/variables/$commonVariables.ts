import { atom } from 'jotai'

const commonVariables = {
  flow: [
    { label: 'flow id', slug: 'flow_id', dType: 'string' },
    { label: 'flow name', slug: 'flow_name', dType: 'string' },
    { label: 'flow description', slug: 'flow_description', dType: 'string' },
    { label: 'flow status', slug: 'flow_status', dType: 'string' },
    { label: 'flow start time', slug: 'flow_start_time', dType: 'string' },
    { label: 'flow end time', slug: 'flow_end_time', dType: 'string' }
  ],
  math: [
    { label: 'pi', slug: 'pi', dType: 'number' },
    { label: 'e', slug: 'e', dType: 'number' },
    { label: 'random', slug: 'random', dType: 'number' }
  ],
  wp: [
    { label: 'user id', slug: 'user_id', dType: 'number' },
    { label: 'user name', slug: 'user_name', dType: 'string' },
    { label: 'user email', slug: 'user_email', dType: 'string' },
    { label: 'timestamp', slug: 'timestamp', dType: 'number' },
    { label: 'total post count', slug: 'total_post_count', dType: 'number' }
  ],
  system: [
    { label: 'php version', slug: 'php_version', dType: 'number' },
    { label: 'wp version', slug: 'wp_version', dType: 'number' },
    { label: 'server name', slug: 'server_name', dType: 'string' },
    { label: 'server protocol', slug: 'server_protocol', dType: 'string' },
    { label: 'timestamp', slug: 'timestamp', dType: 'number' },
    { label: 'date', slug: 'date', dType: 'string' },
    { label: 'time', slug: 'time', dType: 'string' },
    { label: 'day of week', slug: 'day_of_week', dType: 'string' },
    { label: 'day of month', slug: 'day_of_month', dType: 'number' }
  ],
  stringFunction: [
    { slug: 'length', args: ['string'], return: 'number' },
    { slug: 'lowercase', args: ['string'], return: 'string' }
  ],
  mathFunctions: [
    { slug: 'abs', args: ['number'], return: 'number' },
    { slug: 'max', args: ['number', 'number'], return: 'number' },
    { slug: 'ceil', args: ['number', 'number'], return: 'number' },
    { slug: 'math', args: ['...'], return: 'number' }
  ]
}

const $commonVariables = atom(commonVariables)

export default $commonVariables
