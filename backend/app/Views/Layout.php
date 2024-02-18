<?php

// phpcs:disable Squiz.NamingConventions.ValidVariableName.NotCamelCaps

namespace BitApps\Pi\Views;

use BitApps\Pi\Config;
use BitApps\Pi\Deps\BitApps\WPKit\Helpers\DateTimeHelper;
use BitApps\Pi\Deps\BitApps\WPKit\Hooks\Hooks;
use BitApps\Pi\Deps\BitApps\WPKit\Utils\Capabilities;

/**
 * The admin Layout and page handler class.
 */
final class Layout
{
    public const FONT_URL = 'https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&display=swap';

    public function __construct()
    {
        // Hooks::addAction('wp_print_scripts', [$this,'pmRemoveAllScripts'], 100);
        Hooks::addAction('in_admin_header', [$this, 'RemoveAdminNotices']);
        Hooks::addAction('admin_menu', [$this, 'sideBarMenuItem']);
        Hooks::addAction('admin_enqueue_scripts', [$this, 'head'], 0);
    }

    /**
     * Register the admin left sidebar menu item.
     */
    public function sideBarMenuItem()
    {
        $menus = Hooks::applyFilter(Config::withPrefix('admin_sidebar_menu'), Config::get('SIDE_BAR_MENU'));
        global $submenu;
        foreach ($menus as $menu) {
            if (isset($menu['capability']) && Capabilities::check($menu['capability'])) {
                if ($menu['type'] === 'menu') {
                    add_menu_page(
                        $menu['title'],
                        $menu['name'],
                        $menu['capability'],
                        $menu['slug'],
                        $menu['callback'],
                        $menu['icon'],
                        $menu['position']
                    );
                } else {
                    $submenu[$menu['parent']][] = [$menu['name'], $menu['capability'], 'admin.php?page=' . $menu['slug']];
                }
            }
        }
    }

    public function pmRemoveAllScripts()
    {
        global $wp_scripts;
        // echo "<pre>";
        // $a[0] = $wp_scripts->queue[6];
        // $wp_scripts->queue = $a;
        unset($wp_scripts->queue[0], $wp_scripts->queue[1], $wp_scripts->queue[2], $wp_scripts->queue[3], $wp_scripts->queue[4], $wp_scripts->queue[5], $wp_scripts->queue[7], $wp_scripts->queue[8], $wp_scripts->queue[9], $wp_scripts->queue[10], $wp_scripts->queue[11], $wp_scripts->queue[12], $wp_scripts->queue[13]);

        print_r($wp_scripts->queue);
        // print_r($wp_scripts->queue[6]);
    }

    /**
     * Load the asset libraries.
     *
     * @param string $currentScreen $top_level_page variable for current page
     */
    public function head($currentScreen)
    {
        if (strpos($currentScreen, Config::SLUG) === false) {
            return;
        }

        $version = Config::VERSION;
        $slug = Config::SLUG;

        wp_enqueue_style($slug . '-googleapis-PRECONNECT', 'https://fonts.googleapis.com', [], $version);
        wp_enqueue_style($slug . '-gstatic-PRECONNECT-CROSSORIGIN', 'https://fonts.gstatic.com', [], $version);
        wp_enqueue_style($slug . '-font', self::FONT_URL, [], $version);

        if (Config::isDev()) {
            wp_enqueue_script($slug . '-vite-client-helper-MODULE', Config::DEV_URL . '/config/devHotModule.js', [], null);
            wp_enqueue_script($slug . '-vite-client-MODULE', Config::DEV_URL . '/@vite/client', [], null);
            wp_enqueue_script($slug . '-index-MODULE', Config::DEV_URL . '/main.tsx', [], null);
        } else {
            wp_enqueue_script($slug . '-index-MODULE', Config::get('ASSET_URI') . '/main.js', [], $version);
            wp_enqueue_style($slug . '-styles', Config::get('ASSET_URI') . '/main.css', null, $version, 'screen');
        }

        wp_localize_script(Config::SLUG . '-index-MODULE', Config::VAR_PREFIX, self::createConfigVariable());
    }

    public function body()
    {
        $assetURI = Config::get('ASSET_URI');
        // phpcs:disable Generic.PHP.ForbiddenFunctions.Found
        // phpcs:disable WordPress.Security.EscapeOutput.HeredocOutputNotEscaped

        $allowedTags = [
            'noscript' => [],
            'div'      => [
                'id'    => [],
                'style' => []
            ],
            'h1'  => [],
            'img' => [
                'alt'   => [],
                'class' => [],
                'width' => [],
                'src'   => []
            ],
            'p' => [],
        ];

        echo wp_kses("<noscript>You need to enable JavaScript to run this app.</noscript>
        <div id=bit-apps-root>
          <div
            style=display:flex;flex-direction:column;justify-content:center;align-items:center;height:90vh;font-family:Tahoma, Geneva, Verdana, sans-serif;>
            <img alt=app-logo class=bit-logo width=70 src={$assetURI}/img/logo.svg>
            <h1>Welcome to Bit Pi.</h1>
            <p></p>
          </div>
         </div>", $allowedTags);
    }

    public function RemoveAdminNotices()
    {
        global $plugin_page;
        if (empty($plugin_page) || strpos($plugin_page, Config::SLUG) === false) {
            return;
        }

        remove_all_actions('admin_notices');
        remove_all_actions('all_admin_notices');
    }

    public function createConfigVariable()
    {
        $frontendVars = apply_filters(
            Config::withPrefix('localized_script'),
            [
                'nonce'       => wp_create_nonce(Config::withPrefix('nonce')),
                'rootURL'     => Config::get('ROOT_URI'),
                'assetsURL'   => Config::get('ASSET_URI'),
                'baseURL'     => Config::get('ADMIN_URL') . 'admin.php?page=' . Config::SLUG . '#',
                'ajaxURL'     => admin_url('admin-ajax.php'),
                'apiURL'      => Config::get('API_URL'),
                'routePrefix' => Config::VAR_PREFIX,
                'settings'    => Config::getOption('settings'),
                'dateFormat'  => Config::getOption('date_format', true),
                'timeFormat'  => Config::getOption('time_format', true),
                'timeZone'    => DateTimeHelper::wp_timezone_string(),
                'pluginSlug'  => Config::SLUG,
            ]
        );
        if (get_locale() !== 'en_US' && file_exists(Config::get('BASEDIR') . '/languages/generatedString.php')) {
            include_once Config::get('BASEDIR') . '/languages/generatedString.php';
            $frontendVars['translations'] = Config::withPrefix('i18n_strings');
        }

        return $frontendVars;
    }
}
