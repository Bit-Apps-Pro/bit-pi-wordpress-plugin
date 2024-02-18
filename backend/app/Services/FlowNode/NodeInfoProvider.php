<?php

namespace BitApps\Pi\Services\FlowNode;

use BitApps\Pi\Deps\BitApps\WPKit\Helpers\JSON;
use BitApps\Pi\Helpers\FieldManipulation;

class NodeInfoProvider
{
    private $flowId;

    private $nodeId;

    private $previousNodeId;

    private $appSlug;

    private $machineSlug;

    private $fieldMap;

    private $variables;

    private $data;

    public function __construct($node)
    {
        $this->flowId = $node['flow_id'];
        $this->nodeId = $node['node_id'];
        $this->appSlug = $node['app_slug'];
        $this->machineSlug = $node['machine_slug'];
        $this->fieldMap = JSON::decode(JSON::encode($node['field_mapping']), true);
        $this->data = JSON::decode(JSON::encode($node['data']), true);
    }

    public function getFieldMapConfigs($path = null)
    {
        $valueFromPath = FieldManipulation::getValueFromPath($this->fieldMap['configs'], $path);

        return FieldManipulation::processConfigs($valueFromPath);
    }

    public function getFieldMapData()
    {
        return FieldManipulation::processData($this->fieldMap['data']);
    }

    public function getFieldMapRepeaters($path = null, $returnType = null)
    {
        $valueFromPath = FieldManipulation::getValueFromPath($this->fieldMap['repeaters'], $path);

        return FieldManipulation::processRepeaters($valueFromPath, $returnType);
    }

    public function getFlowId()
    {
        return $this->flowId;
    }

    public function getNodeId()
    {
        return $this->nodeId;
    }

    public function getPreviousNodeId()
    {
        return $this->previousNodeId;
    }

    public function getAppSlug()
    {
        return $this->appSlug;
    }

    public function getMachineSlug()
    {
        return $this->machineSlug;
    }

    public function getFieldMap($path = null)
    {
        if ($path) {
            return FieldManipulation::getValueFromPath($this->fieldMap, $path);
        }

        return $this->fieldMap;
    }

    public function getVariables()
    {
        return $this->variables;
    }

    public function getData()
    {
        return $this->data;
    }
}
