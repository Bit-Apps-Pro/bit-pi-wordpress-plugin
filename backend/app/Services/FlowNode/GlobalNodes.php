<?php

namespace BitApps\Pi\Services\FlowNode;

use BitApps\Pi\Deps\BitApps\WPKit\Helpers\JSON;
use BitApps\Pi\Helpers\Parser;
use BitApps\Pi\Model\FlowNode;

class GlobalNodes
{
    private static $instance;

    private $nodeData;

    private function __construct($flowId)
    {
        $this->nodeData = $this->fetchNodeData($flowId);
    }

    public static function getInstance($flowId)
    {
        if (self::$instance === null) {
            self::$instance = new self($flowId);
        }

        return self::$instance;
    }

    public function getAllNodeData()
    {
        return $this->nodeData;
    }

    public static function setExecutedNodeVariables($nodes)
    {
        foreach ($nodes as $node) {
            if ($node->current_variables !== null) {
                $nodeVariables[$node->node_id] = Parser::parseArrayStructure(JSON::maybeDecode($node->current_variables));
            }
        }
    }

    private function fetchNodeData($flowId)
    {
        return FlowNode::where('flow_id', $flowId)->all();
    }
}
