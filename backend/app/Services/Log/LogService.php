<?php

namespace BitApps\Pi\Services\Log;

use BitApps\Pi\Model\FlowLog;

class LogService
{
    public static function save($logs)
    {
        if (!empty($logs)) {
            return FlowLog::insert($logs);
        }

        return false;
    }
}
