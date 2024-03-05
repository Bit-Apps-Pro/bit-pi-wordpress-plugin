function getServerVariable(key: keyof typeof SERVER_VARIABLES, fallback?: unknown) {
  if (!(key in SERVER_VARIABLES) || !SERVER_VARIABLES[key]) {
    console.error('🚥🚥🚥 Missing server variable: ', key) // eslint-disable-line no-console
    return fallback
  }
  return SERVER_VARIABLES[key]
}

interface ConfigType {
  IS_DEV: boolean
  IS_PRO: boolean
  PRODUCT_NAME: string
  PLUGIN_SLUG: string
  AJAX_URL: string
  API_URL: { base: string; separator: string }
  ROOT_URL: string
  NONCE: string
  ROUTE_PREFIX: string
}

const config = {
  IS_DEV: true,
  IS_PRO: SERVER_VARIABLES.isPro === '1',
  PRODUCT_NAME: 'Bit Pi',
  PLUGIN_SLUG: getServerVariable('pluginSlug'),
  AJAX_URL: getServerVariable('ajaxURL', 'http://.local/wp-admin/admin-ajax.php'),
  API_URL: getServerVariable('apiURL', {
    base: 'http://bitflow.test/wp-json/bit-flow/v1',
    separator: '?'
  }),
  ROOT_URL: getServerVariable('rootURL', 'http://.local'),
  NONCE: getServerVariable('nonce', ''),
  ROUTE_PREFIX: getServerVariable('routePrefix', 'bit_pi_')
} as ConfigType

export default config
