<?php

namespace BitApps\Pi\Services\Log;

class LogManager
{
    private static $instance;

    private $logs = [];

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function addLog($log)
    {
        $this->logs[] = $log;
    }

    public static function getLogs()
    {
        return self::getInstance()->logs;
    }

    public static function destroy()
    {
        self::$instance = null;
    }
}
