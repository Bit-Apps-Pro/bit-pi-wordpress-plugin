<?php

namespace BitApps\Pi\Services\FlowNode;

use BitApps\Pi\Deps\BitApps\WPKit\Helpers\JSON;
use BitApps\Pi\Helpers\Node;
use BitApps\Pi\Services\Exception\MissingKeyException;
use BitApps\Pi\Services\Exception\PlatformNotFoundException;
use BitApps\Pi\Services\GlobalNodeVariables;
use BitApps\Pi\Services\Log\LogManager;
use BitApps\Pi\Services\Tools\Condition\ConditionalLogic;
use BitApps\Pi\Services\Tools\Delay\Delay;

class NodeExecutor
{
    private $logInstance;

    public function __construct()
    {
        $this->logInstance = LogManager::getInstance();
    }

    /**
     * Execute the node action.
     *
     * @param     $currentNodeInfo
     * @param int $flowId
     * @param int $flowHistoryId
     *
     * @return array
     */
    public function handleActionNode($currentNodeInfo, $flowId, $flowHistoryId)
    {
        $log = [
            'flow_history_id' => $flowHistoryId,
            'node_id'         => $currentNodeInfo->node_id,
        ];

        $nodeVariableInstance = GlobalNodeVariables::getInstance();

        $app = $this->doesActionExist($currentNodeInfo->app_slug);

        if (!$app) {
            throw new PlatformNotFoundException($currentNodeInfo->app_slug);
        }

        $startTime = microtime(true);
        $action = new $app(new NodeInfoProvider($currentNodeInfo));
        $response = $action->execute();
        $endTime = microtime(true);
        $duration = number_format($endTime - $startTime, 2);

        if (!isset($response['input'], $response['output'], $response['status'])) {
            throw new MissingKeyException();
        }

        $nodeVariableInstance->setVariables($currentNodeInfo->node_id, $response['output']);

        error_log('node id -' . $currentNodeInfo->node_id);

        $log['input'] = JSON::maybeEncode($response['input']);
        $log['output'] = JSON::maybeEncode($response['output']);
        $log['status'] = $response['status'];
        $log['details'] = JSON::encode(
            [
                'duration'  => $duration,
                'data_size' => number_format(mb_strlen($log['input'], '8bit') / 1024, 2),
            ]
        );
        $this->logInstance->addLog($log);

        return $response['status'];
    }

    public function handleConditionLogicNode($currentNode, $flowId, $flowHistoryId = null)
    {
        $nodeInstance = GlobalNodes::getInstance($flowId);
        $nodes = $nodeInstance->getAllNodeData();

        $currentNodeInfo = Node::getNodeInfoById($currentNode->previous, $nodes);
        $condition = Node::getConditionsByNodeId($currentNode->id, $currentNodeInfo);
        $conditionStatus = (bool) ($condition && !ConditionalLogic::conditionStatus($condition));

        $this->logInstance->addLog([
            'flow_history_id' => $flowHistoryId,
            'node_id'         => $currentNodeInfo->node_id,
            'status'          => $conditionStatus === false ? 'error' : 'success',
            'input'           => JSON::encode($condition),
            'output'          => null,
            'details'         => null,
        ]);

        return $conditionStatus;
    }

    public function handleDelayNode($currentNodeInfo, $flowId, $flowHistoryId)
    {
        $logs = Delay::setDelay($currentNodeInfo, $flowId, $flowHistoryId);

        $this->logInstance->addLog($logs);

        return true;
    }

    public function handleTriggerNode($currentNode, $triggerData, $nodeInstance, $flowHistoryId)
    {
        $nodeInstance->setVariables($currentNode->id, $triggerData);

        $this->logInstance->addLog([
            'flow_history_id' => $flowHistoryId,
            'node_id'         => $currentNode->id,
            'status'          => true,
            'input'           => null,
            'output'          => JSON::encode($triggerData),
            'details'         => null,
        ]);

        return false;
    }

    /**
     * Check if action exist.
     *
     * @param string $appSlug
     *
     * @return string || bool
     */
    public function doesActionExist($appSlug)
    {
        $appSlug = ucfirst($appSlug);

        if (class_exists("BitApps\\Pi\\Services\\Apps\\{$appSlug}\\{$appSlug}Action")) {
            return "BitApps\\Pi\\Services\\Apps\\{$appSlug}\\{$appSlug}Action";
        } elseif (class_exists("BitApps\\PiPro\\Services\\Apps\\{$appSlug}\\{$appSlug}Action")) {
            return "BitApps\\PiPro\\Services\\Apps\\{$appSlug}\\{$appSlug}Action";
        }

        return false;
    }

    /**
     * Check error node id is exists in next node variables.
     *
     * @param int    $flowId
     * @param object $errorNode
     *
     * @return bool
     */
    public function hasErrorNodeIdInNextNodes($flowId, $errorNode)
    {
        $queue[] = $errorNode;
        $foundMatchingNodeId = false;

        $nodeInstance = GlobalNodes::getInstance($flowId);
        $nodes = $nodeInstance->getAllNodeData();

        while (\count($queue) > 0) {
            $currentNode = array_shift($queue);
            $id = $currentNode->id;

            if ($foundMatchingNodeId) {
                $nodeDetails = Node::getNodeInfoById($id, $nodes);
                $result = Node::searchNodeKey(JSON::maybeDecode($nodeDetails['field_mapping']), 'nodeId', $errorNode->id);

                $hasErrorId = (bool) ($result !== null);

                if ($hasErrorId) {
                    return true;
                }
            }

            if ($id === $errorNode->id && isset($currentNode->next)) {
                $foundMatchingNodeId = true;
                $queue[] = $currentNode->next;
            }

            if (isset($currentNode->next)) {
                if ($currentNode->type === 'router') {
                    foreach ($currentNode->next as $childNode) {
                        $queue[] = $childNode;
                    }
                } else {
                    $queue[] = $currentNode->next;
                }
            } else {
                $queue = [];
            }
        }

        return false;
    }
}
