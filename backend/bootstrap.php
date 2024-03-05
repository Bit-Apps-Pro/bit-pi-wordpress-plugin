<?php

use BitApps\Pi\Config;
use BitApps\Pi\Dotenv;

if (! defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/../vendor/autoload_packages.php';

Dotenv::load(plugin_dir_path(__DIR__) . '.env');

BitApps\Pi\Plugin::load();

if (Config::isDevPro()) {
    require_once __DIR__ . './../backend/dev-mode/pro-load.php';
}
