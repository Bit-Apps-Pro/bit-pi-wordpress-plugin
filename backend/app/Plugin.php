<?php

namespace BitApps\Pi;

/*
 * Main class for the plugin.
 *
 * @since 1.0.0-alpha
 */

use BitApps\Pi\HTTP\Middleware\AdminCheckerMiddleware;
use BitApps\Pi\HTTP\Middleware\NonceCheckerMiddleware;
use BitApps\Pi\Providers\HookProvider;
use BitApps\Pi\Providers\InstallerProvider;
use BitApps\Pi\Views\HtmlTagModifier;
use BitApps\Pi\Views\Layout;
use BitApps\WPDatabase\Connection;
use BitApps\WPKit\Hooks\Hooks;
use BitApps\WPKit\Http\RequestType;
use BitApps\WPKit\Migration\MigrationHelper;
use BitApps\WPKit\Utils\Capabilities;

final class Plugin
{
    /**
     * Main instance of the plugin.
     *
     * @since 1.0.0-alpha
     *
     * @var Plugin|null
     */
    private static $_instance;

    private $_registeredMiddleware = [];

    /**
     * Initialize the Plugin with hooks.
     */
    public function __construct()
    {
        Connection::setPluginPrefix(Config::VAR_PREFIX);

        $this->registerInstaller();

        Hooks::addAction('plugins_loaded', [$this, 'loaded']);
    }

    public function registerInstaller()
    {
        $installerProvider = new InstallerProvider();
        $installerProvider->register();
    }

    /**
     * Load the plugin.
     */
    public function loaded()
    {
        Hooks::doAction(Config::withPrefix('loaded'));
        Hooks::addAction('init', [$this, 'registerProviders'], 11);
        Hooks::addFilter('plugin_action_links_' . Config::get('BASENAME'), [$this, 'actionLinks']);
        $this->maybeMigrateDB();
    }

    public function middlewares()
    {
        return [
            'nonce'   => NonceCheckerMiddleware::class,
            'isAdmin' => AdminCheckerMiddleware::class,
        ];
    }

    public function getMiddleware($name)
    {
        if (isset($this->_registeredMiddleware[$name])) {
            return $this->_registeredMiddleware[$name];
        }

        $middlewares = $this->middlewares();
        if (isset($middlewares[$name]) && class_exists($middlewares[$name]) && method_exists($middlewares[$name], 'handle')) {
            $this->_registeredMiddleware[$name] = new $middlewares[$name]();
        } else {
            return false;
        }

        return $this->_registeredMiddleware[$name];
    }

    /**
     * Instantiate the Provider class.
     */
    public function registerProviders()
    {
        if (RequestType::is('admin')) {
            new Layout();
            new HtmlTagModifier();
        }

        new HookProvider();
    }

    /**
     * Plugin action links.
     *
     * @param array $links Array of links
     *
     * @return array
     */
    public function actionLinks($links)
    {
        $linksToAdd = Config::get('PLUGIN_PAGE_LINKS');
        foreach ($linksToAdd as $link) {
            $links[] = '<a href="' . $link['url'] . '">' . $link['title'] . '</a>';
        }

        return $links;
    }

    public static function maybeMigrateDB()
    {
        if (!Capabilities::check('manage_options')) {
            return;
        }

        if (version_compare(Config::getOption('db_version'), Config::DB_VERSION, '<')) {
            MigrationHelper::migrate(InstallerProvider::migration());
        }
    }

    /**
     * Retrieves the main instance of the plugin.
     *
     * @since 1.0.0-alpha
     *
     * @return Plugin plugin main instance
     */
    public static function instance()
    {
        return static::$_instance;
    }

    /**
     * Loads the plugin main instance and initializes it.
     *
     * @return bool True if the plugin main instance could be loaded, false otherwise
     *
     * @since 1.0.0-alpha
     */
    public static function load()
    {
        if (static::$_instance !== null) {
            return false;
        }

        static::$_instance = new static();

        return true;
    }
}
