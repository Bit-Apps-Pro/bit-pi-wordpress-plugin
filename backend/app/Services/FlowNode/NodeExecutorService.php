<?php

namespace BitApps\Pi\Services\FlowNode;

use BitApps\Pi\Config;
use BitApps\Pi\Helpers\Parser;
use BitApps\Pi\Model\FlowNode;
use BitApps\WPKit\Helpers\JSON;

class NodeExecutorService
{
    public static function saveNodeVariables($flowId, $responses, $nodeId = null)
    {
        $table = Config::get('WP_DB_PREFIX') . Config::VAR_PREFIX . 'flow_nodes';
        $cases = [];
        $ids = [];
        $placeholders = '';
        $variables = '';
        $column = 'variables';

        if (!empty($nodeId)) {
            $responses = [$nodeId => $responses];
        }

        foreach ($responses as $key => $response) {
            $cases[] = 'WHEN node_id = %s THEN %s';
            $ids[] = $key;
            $placeholders .= '%s';
            $variables .= $key . '${bf}' . JSON::maybeEncode(Parser::parseResponse($response));

            if (array_key_last($responses) !== $key) {
                $variables .= '${bf}';
                $placeholders .= ',';
            }
        }

        $values = array_merge(explode('${bf}', $variables), $ids);
        $cases = implode(' ', $cases);

        $query = "UPDATE {$table}
          SET {$column} = CASE
            {$cases}
          END
          WHERE node_id IN ({$placeholders}) AND flow_id = %d";

        $values[] = $flowId;

        return FlowNode::raw($query, $values);
    }
}
