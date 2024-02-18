<?php

namespace BitApps\Pi\Services;

use BitApps\Pi\Model\FlowLog;

class GlobalNodeVariables
{
    private static $instance;

    private $nodeVariables = [];

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public static function getVariables()
    {
        return self::getInstance()->nodeVariables;
    }

    public function setVariables($nodeId, $response)
    {
        $this->nodeVariables[$nodeId] = $response;
    }

    // public function setFailNodes()
    // {
    // }

    // public function getFailedNodes()
    // {
    // }

    public function setExecutedNodeVariables($flowHistoryId)
    {
        $logs = FlowLog::where('flow_history_id', $flowHistoryId)->get();
        foreach ($logs as $log) {
            if ($log->output !== null) {
                $this->nodeVariables[$log->node_id] = $log->output;
            }
        }
    }

    public function destroy()
    {
        self::$instance = null;
    }
}
