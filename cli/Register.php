<?php

use BitApps\Pi\CLI\DatabaseCommand;
use BitApps\Pi\CLI\PLuginCommand;
use BitApps\Pi\Config;

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command(Config::SLUG . ' db', new DatabaseCommand());
    WP_CLI::add_command(Config::SLUG . ' use', new PLuginCommand());
}
