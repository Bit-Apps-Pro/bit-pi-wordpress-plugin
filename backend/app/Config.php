<?php

// phpcs:disable Squiz.NamingConventions.ValidVariableName

namespace BitApps\Pi;

use BitApps\Pi\Views\Layout;

if (!\defined('ABSPATH')) {
    exit;
}

/**
 * Provides App configurations.
 */
class Config
{
    public const SLUG = 'bit-pi';

    public const PRO_PLUGIN_SLUG = 'bit-pi-pro';

    public const TITLE = 'Bit Pi';

    public const VAR_PREFIX = 'bit_pi_';

    public const VERSION = '1.0';

    public const DB_VERSION = '1.0';

    public const REQUIRED_PHP_VERSION = '7.4';

    public const REQUIRED_WP_VERSION = '5.0';

    public const API_VERSION = '1.0';

    public const APP_BASE = '../../' . self::SLUG . '.php';

    public const CLASS_PREFIX = 'BitAppsPi';

    /**
     * Provides configuration for plugin.
     *
     * @param string $type    Type of conf
     * @param string $default Default value
     *
     * @return array|string|null
     */
    public static function get($type, $default = null)
    {
        switch ($type) {
            case 'MAIN_FILE':
                return realpath(__DIR__ . DIRECTORY_SEPARATOR . self::APP_BASE);

            case 'BASENAME':
                return plugin_basename(trim(self::get('MAIN_FILE')));

            case 'BASEDIR':
                return plugin_dir_path(self::get('MAIN_FILE')) . 'backend';

            case 'SITE_URL':
                $parsedUrl = wp_parse_url(get_admin_url());
                $siteUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];
                $siteUrl .= empty($parsedUrl['port']) ? null : ':' . $parsedUrl['port'];

                return $siteUrl;

            case 'ADMIN_URL':
                return str_replace(self::get('SITE_URL'), '', get_admin_url());

            case 'API_URL':
                global $wp_rewrite;

                return [
                    'base'      => get_rest_url() . self::SLUG . '/v1',
                    'separator' => $wp_rewrite->permalink_structure ? '?' : '&',
                ];

            case 'DEV_URL':
                return isset($_ENV['DEV_URL']) ? $_ENV['DEV_URL'] : null;

            case 'ROOT_URI':
                return set_url_scheme(plugins_url('', self::get('MAIN_FILE')), wp_parse_url(home_url())['scheme']);

            case 'ASSET_URI':
                return self::get('ROOT_URI') . '/assets';

            case 'ASSET_JS_URI':
                return self::get('ASSET_URI') . '/js';

            case 'ASSET_CSS_URI':
                return self::get('ASSET_URI') . '/css';

            case 'PLUGIN_PAGE_LINKS':
                return self::pluginPageLinks();

            case 'SIDE_BAR_MENU':
                return self::sideBarMenu();

            case 'WP_DB_PREFIX':
                global $wpdb;

                return $wpdb->prefix;

            default:
                return $default;
        }
    }

    /**
     * Prefixed variable name with prefix.
     *
     * @param string $option Variable name
     *
     * @return array
     */
    public static function withPrefix($option)
    {
        return self::VAR_PREFIX . $option;
    }

    /**
     * Prefixed table name with db prefix and var prefix.
     *
     * @param mixed $table
     *
     * @return string
     */
    public static function withDBPrefix($table)
    {
        return self::get('WP_DB_PREFIX') . self::withPrefix($table);
    }

    /**
     * Retrieves options from option table.
     *
     * @param string $option  Option name
     * @param bool   $default default value
     * @param bool   $wp      Whether option is default wp option
     *
     * @return mixed
     */
    public static function getOption($option, $default = false, $wp = false)
    {
        if ($wp) {
            return get_option($option, $default);
        }

        return get_option(self::withPrefix($option), $default);
    }

    /**
     * Saves option to option table.
     *
     * @param string $option   Option name
     * @param bool   $autoload Whether option will autoload
     * @param mixed  $value
     *
     * @return bool
     */
    public static function addOption($option, $value, $autoload = false)
    {
        return add_option(self::withPrefix($option), $value, '', $autoload ? 'yes' : 'no');
    }

    /**
     * Save or update option to option table.
     *
     * @param string $option   Option name
     * @param mixed  $value    Option value
     * @param bool   $autoload Whether option will autoload
     *
     * @return bool
     */
    public static function updateOption($option, $value, $autoload = null)
    {
        return update_option(self::withPrefix($option), $value, !\is_null($autoload) ? 'yes' : null);
    }

    public static function deleteOption($option)
    {
        return delete_option(self::withPrefix($option));
    }

    public static function isDev()
    {
        return isset($_ENV['DEV']) ? $_ENV['DEV'] : false;
    }

    /**
     * Provides links for plugin pages. Those links will bi displayed in
     * all plugin pages under the plugin name.
     *
     * @return array
     */
    private static function pluginPageLinks()
    {
        return [
            'settings' => [
                'title' => __('Settings', 'bit-pi'),
                'url'   => self::get('ADMIN_URL') . 'admin.php?page=' . self::SLUG . '#settings',
            ],
            'help' => [
                'title' => __('Help', 'bit-pi'),
                'url'   => self::get('ADMIN_URL') . 'admin.php?page=' . self::SLUG . '#help',
            ],
        ];
    }

    /**
     * Provides menus for wordpress admin sidebar.
     * should return an array of menus with the following structure:
     * [
     *   'type' => menu | submenu,
     *  'name' => 'Name of menu will shown in sidebar',
     *  'capability' => 'capability required to access menu',
     *  'slug' => 'slug of menu after ?page=',.
     *
     *  'title' => 'page title will be shown in browser title if type is menu',
     *  'callback' => 'function to call when menu is clicked',
     *  'icon' =>   'icon to display in menu if menu type is menu',
     *  'position' => 'position of menu in sidebar if menu type is menu',
     *
     * 'parent' => 'parent slug if submenu'
     * ]
     *
     * @return array
     */
    private static function sideBarMenu()
    {
        $adminViews = new Layout();

        return [
            'Home' => [
                'type'       => 'menu',
                'title'      => __("Bit Pi - Your flow of automation's", 'bit-pi'),
                'name'       => __('Bit Pi', 'bit-pi'),
                'capability' => 'manage_options',
                'slug'       => self::SLUG,
                'callback'   => [$adminViews, 'body'],
                'icon'       => 'dashicons-admin-home',
                'position'   => '20',
            ],
            'Dashboard' => [
                'parent'     => self::SLUG,
                'type'       => 'submenu',
                'name'       => 'Dashboard',
                'capability' => 'manage_options',
                'slug'       => self::SLUG . '#/',
            ],
            'All Flows' => [
                'parent'     => self::SLUG,
                'type'       => 'submenu',
                'name'       => 'Flows',
                'capability' => 'manage_options',
                'slug'       => self::SLUG . '#/flows',
            ],
            'Connections' => [
                'parent'     => self::SLUG,
                'type'       => 'submenu',
                'name'       => 'Connections',
                'capability' => 'manage_options',
                'slug'       => self::SLUG . '#/connections',
            ],
            'Webhooks' => [
                'parent'     => self::SLUG,
                'type'       => 'submenu',
                'name'       => 'Webhooks',
                'capability' => 'manage_options',
                'slug'       => self::SLUG . '#/webhooks',
            ],
        ];
    }
}
