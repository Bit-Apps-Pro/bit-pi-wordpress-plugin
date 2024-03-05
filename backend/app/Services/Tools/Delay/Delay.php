<?php

namespace BitApps\Pi\Services\Tools\Delay;

use BitApps\Pi\Config;
use BitApps\Pi\Model\Flow;
use BitApps\Pi\Model\FlowLog;
use BitApps\Pi\Services\Flow\FlowExecutor;
use BitApps\Pi\Services\FlowNode\NodeInfoProvider;
use BitApps\WPKit\Helpers\JSON;

class Delay
{
    public const DELAY_UNITS = [
        'minutes' => 60,
        'hours'   => 3600,
        'days'    => 86400,
        'weeks'   => 604800,
        'months'  => 2592000
    ];

    protected static $nodeInfoProvider;

    /**
     * Set delay.
     *
     * @param collection $node
     * @param mixed      $flowId
     * @param int        $flowHistoryId
     *
     * @return void
     */
    public static function setDelay($node, $flowId, $flowHistoryId)
    {
        static::$nodeInfoProvider = new NodeInfoProvider($node);
        $config = static::$nodeInfoProvider->getData()['delay'];

        if (!isset($config['delayUnit'],$config['delayValue'])) {
            // TODO: eikan e kaj kora lagbe
            // $messages = [
            //     'init' => 'missing required argument',
            // ];
            // $logInstance->save([
            //     'flow_history_id' => $flowHistoryId,
            //     'node_id'         => $node->node_id,
            //     'status'          => 'error',
            //     'input'           => JSON::encode($config),
            //     'output'          => null,
            //     // 'messages'        => JSON::encode($messages)
            // ]);
        }

        $interVal = $config['delayValue'] * static::DELAY_UNITS[$config['delayUnit']];

        $eventId = Config::VAR_PREFIX . 'execute_delayed_flow';

        if (!wp_next_scheduled($eventId)) {
            $args = [
                'flowId'        => $flowId,
                'flowHistoryId' => $flowHistoryId,
            ];

            $isDelayed = wp_schedule_single_event(time() + $interVal, $eventId, $args);
            error_log('delayed');

            return [
                'flow_history_id' => $flowHistoryId,
                'node_id'         => $node->node_id,
                'status'          => $isDelayed === false ? 'error' : 'success',
                'input'           => JSON::encode($args),
                'output'          => null,
                'details'         => null
            ];

            // TODO eiakn e kaj kora lagbe
            // Delay howar somoi status update kora lagbe..
            // $logInstance->save([
            //     'flow_history_id' => $flowHistoryId,
            //     'node_id'         => $node->node_id,
            //     'status'          => $isDelayed === true ? 'success' : 'error',
            //     'input'           => JSON::encode($args),
            //     'output'          => null,

            // ]);
            // if ($isDelayed) {
            //     return [
            //         'success'  => true,
            //         'response' => $args,
            //         'message'  => 'The execution has been postponed for a duration of ' . $config['delayValue'] . ' ' . $config['delayUnit'],
            //     ];
            // }

            // return [
            //     'success'  => false,
            //     'response' => $args,
            //     'message'  => 'Delay not scheduled',
            // ];
        }
    }

    /**
     * Execute Delay flow.
     *
     * @param int   $flowHistoryId
     * @param mixed $flowId
     *
     * @return void
     */
    public static function executeDelayedFlow($flowId, $flowHistoryId)
    {
        $flowLogs = FlowLog::select(['node_id', 'status'])->where('flow_history_id', $flowHistoryId)->get();
        if ($flowLogs) {
            $flowNodes = Flow::select(['map', 'listener_type', 'is_hook_capture', 'id', 'is_active'])->with('nodes', function ($query) {
                $query->select(['*']);
            })->where('id', $flowId)->first();

            if ($flowNodes && !empty($flowNodes->nodes) && !empty($flowNodes->map)) {
                $executedIds = [];

                if (!empty($flowLogs)) {
                    $executedIds = array_map(function ($item) {
                        return $item->node_id;
                    }, $flowLogs);
                }

                FlowExecutor::execute($flowNodes, [], $executedIds, $flowHistoryId);
            } else {
                error_log('flow nodes not found');
            }
        } else {
            error_log('process not found');
        }
    }
}
