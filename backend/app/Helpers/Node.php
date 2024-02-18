<?php

namespace BitApps\Pi\Helpers;

class Node
{
    /**
     * Get node info by node id.
     *
     * @param int   $nodeId
     * @param array $nodes
     *
     * @return collection
     */
    public static function getNodeInfoById($nodeId, $nodes)
    {
        foreach ($nodes as $node) {
            if ($node['node_id'] === $nodeId) {
                return $node;
            }
        }
    }

    /**
     * Get condition node info by node id.
     *
     * @param int        $nodeId
     * @param collection $nodeInfo
     *
     * @return collection
     */
    public static function getConditionsByNodeId($nodeId, $nodeInfo)
    {
        if (empty($nodeInfo->data->conditions)) {
            return false;
        }

        foreach ($nodeInfo->data->conditions as $condition) {
            if ($condition->id === $nodeId) {
                return $condition->condition;
            }
        }
    }

    public static function searchNodeKey($fieldMap, $keyName, $value)
    {
        return self::searchRecursive((array) $fieldMap, $keyName, $value);
    }

    private static function searchRecursive($fieldMap, $keyName, $value)
    {
        foreach ($fieldMap as $key => $val) {
            if (\is_object($val)) {
                $val = (array) $val;
            }

            if ($key === $keyName && $val === $value) {
                return $fieldMap;
            } elseif (\is_array($val)) {
                $result = self::searchRecursive($val, $keyName, $value);
                if ($result !== null) {
                    return $result;
                }
            }
        }
    }
}
