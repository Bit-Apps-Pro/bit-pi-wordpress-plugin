<?php

namespace BitApps\Pi\Providers;

use BitApps\Pi\Config;
use BitApps\Pi\Deps\BitApps\WPKit\Hooks\Hooks;
use BitApps\Pi\Deps\BitApps\WPKit\Http\RequestType;
use BitApps\Pi\Deps\BitApps\WPKit\Http\Router\Router;
use BitApps\Pi\Plugin;
use BitApps\Pi\Services\Tools\Delay\Delay;
use FilesystemIterator;

class HookProvider
{
    private $_pluginBackend;

    public function __construct()
    {
        $this->_pluginBackend = Config::get('BASEDIR') . DIRECTORY_SEPARATOR;
        $this->loadTriggersAjax();
        $this->loadAppHooks();
        $this->loadActionsHooks();
        Hooks::addAction('rest_api_init', [$this, 'loadApi']);
        Hooks::addAction(Config::VAR_PREFIX . 'execute_delayed_flow', [Delay::class, 'executeDelayedFlow'], 10, 2);
        Hooks::addFilter('safe_style_css', [$this, 'allowDisplayStyleAttribute']);

        if (\defined('BIT_PI_CLI_ACTIVE') && BIT_PI_CLI_ACTIVE) {
            include_once __DIR__ . './../../../cli/Register.php';
        }
    }

    public function allowDisplayStyleAttribute($styles)
    {
        $styles[] = 'display';

        return $styles;
    }

    /**
     * Helps to register integration ajax.
     */
    public function loadActionsHooks()
    {
        // $this->includeTaskHooks('Actions');
    }

    /**
     * Loads API routes.
     */
    public function loadApi()
    {
        if (
            is_readable($this->_pluginBackend . 'hooks' . DIRECTORY_SEPARATOR . 'api.php')
            && RequestType::is(RequestType::API)
        ) {
            $router = new Router(RequestType::API, Config::SLUG, 'v1');

            include $this->_pluginBackend . 'hooks' . DIRECTORY_SEPARATOR . 'api.php';
            $router->register();
        }
    }

    /**
     * Helps to register App hooks.
     */
    protected function loadAppHooks()
    {
        if (
            RequestType::is(RequestType::AJAX)
            && is_readable($this->_pluginBackend . 'hooks' . DIRECTORY_SEPARATOR . 'ajax.php')
        ) {
            $router = new Router(RequestType::AJAX, Config::VAR_PREFIX, '');
            $router->setMiddlewares(Plugin::instance()->middlewares());
            include $this->_pluginBackend . 'hooks' . DIRECTORY_SEPARATOR . 'ajax.php';
            $router->register();
        }

        if (is_readable($this->_pluginBackend . 'hooks.php')) {
            include $this->_pluginBackend . 'hooks.php';
        }
    }

    /**
     * Helps to register Triggers ajax.
     */
    protected function loadTriggersAjax()
    {
        $this->includeTaskHooks('Apps');
    }

    /**
     * Backend Routes and Hooks.
     *
     * @param string $taskName Triggers|Actions
     */
    private function includeTaskHooks($taskName)
    {
        $taskDir = $this->_pluginBackend . 'app' . DIRECTORY_SEPARATOR . 'Services' . DIRECTORY_SEPARATOR . $taskName;
        $dirs = new FilesystemIterator($taskDir);
        foreach ($dirs as $dirInfo) {
            if ($dirInfo->isDir()) {
                $taskName = basename($dirInfo);
                $taskPath = $taskDir . DIRECTORY_SEPARATOR . $taskName . DIRECTORY_SEPARATOR;
                if (is_readable($taskPath . 'Routes.php') && RequestType::is('ajax') && RequestType::is('admin')) {
                    $router = new Router(RequestType::AJAX, Config::VAR_PREFIX, '');
                    $router->setMiddlewares(Plugin::instance()->middlewares());
                    include $taskPath . 'Routes.php';
                    $router->register();
                }

                if (is_readable($taskPath . 'Hooks.php')) {
                    include $taskPath . 'Hooks.php';
                }
            }
        }
    }
}
