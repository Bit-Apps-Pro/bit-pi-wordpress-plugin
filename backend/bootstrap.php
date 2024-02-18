<?php

use BitApps\Pi\Config;

if (! defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

if (Config::isDevPro()) {
    require_once __DIR__ . './../backend/dev-mode/pro-load.php';
}
// Initialize the plugin.
BitApps\Pi\Plugin::load();
