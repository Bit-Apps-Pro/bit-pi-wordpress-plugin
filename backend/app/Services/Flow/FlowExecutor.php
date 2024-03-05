<?php

namespace BitApps\Pi\Services\Flow;

use BitApps\Pi\Helpers\Node;
use BitApps\Pi\Model\Flow as FlowModel;
use BitApps\Pi\Model\FlowHistory;
use BitApps\Pi\Services\FlowNode\GlobalNodes;
use BitApps\Pi\Services\FlowNode\NodeExecutor;
use BitApps\Pi\Services\FlowNode\NodeExecutorService;
use BitApps\Pi\Services\FlowService;
use BitApps\Pi\Services\GlobalNodeVariables;
use BitApps\Pi\Services\Log\LogManager;
use BitApps\Pi\Services\Log\LogService;
use Throwable;

class FlowExecutor extends TaskQueueHandler
{
    protected $action = 'background_process_request';

    protected $prefix = 'bit_pi';

    private $nodeExecutor;

    // TODO need to be work in future
    // private $appSettings;

    public function __construct()
    {
        parent::__construct();
        // TODO need to be work in future
        // $this->appSettings  = FlowService::getAppSettings();
        $this->nodeExecutor = new NodeExecutor();
    }

    /**
     * Flow Executor run.
     *
     * @param collection $flow
     * @param mixed      $triggerData
     * @param array      $executedIds
     * @param mixed      $flowHistoryId
     *
     * @return void
     */
    public static function execute($flow, $triggerData = [], $executedIds = [], $flowHistoryId = null)
    {
        if ($flow->listener_type === FlowModel::listenerType['CAPTURE']) {
            NodeExecutorService::saveNodeVariables($flow->id, $triggerData, $flow->map->id);
            FlowService::captureStatusUpdate($flow->id, FlowModel::isHookCaptured);

            return;
        }

        if ($flow->listener_type === FlowModel::listenerType['RUN_ONCE']
        || $flow->is_active === 1) {
            if (!$flowHistoryId) {
                $flowHistory = FlowHistory::insert(
                    [
                        'flow_id' => $flow->id,
                        'status'  => 'processing'
                    ]
                );

                if (!$flowHistory) {
                    return false;
                }

                $flowHistoryId = $flowHistory->id;
            }

            $instance = new self();

            $instance->pushToQueue([
                'tasks'           => $flow->map,
                'flow_id'         => $flow->id,
                'trigger_data'    => $triggerData,
                'executedIds'     => $executedIds,
                'flow_history_id' => $flowHistoryId,
                'listener_type'   => $flow->listener_type
            ]);

            $instance->save()->dispatch();

            return true;
        }

        return false;
    }

    protected function task()
    {
        $currentNode = $this->getCurrentNode();
        $flowHistoryId = $this->getFlowHistoryId();
        $flowId = $this->getFlowId();

        try {
            $executedNodeIds = $this->getExecutedNodeIds();
            $triggerData = $this->getTriggerData();

            $nodeInstance = GlobalNodes::getInstance($flowId);
            $nodeVariablesInstance = GlobalNodeVariables::getInstance();

            if (!\in_array($currentNode->id, $executedNodeIds)) {
                $nodes = $nodeInstance->getAllNodeData();
                $currentNodeInfo = Node::getNodeInfoById($currentNode->id, $nodes);

                switch ($currentNode->type) {
                    case 'trigger':
                        return $this->nodeExecutor->handleTriggerNode($currentNode, $triggerData, $nodeVariablesInstance, $flowHistoryId);

                        break;
                    case 'action':
                        $response = $this->nodeExecutor->handleActionNode($currentNodeInfo, $flowId, $flowHistoryId);

                        return $response === 'error' ? $this->nodeExecutor->hasErrorNodeIdInNextNodes($flowId, $currentNode) : false;

                        break;
                    case 'default-condition-logic':
                        return $this->nodeExecutor->handleConditionLogicNode($currentNode, $flowId, $flowHistoryId);

                        break;
                    case 'condition-logic':
                        return $this->nodeExecutor->handleConditionLogicNode($currentNode, $flowId, $flowHistoryId);

                        break;
                    case 'delay':
                        return $this->nodeExecutor->handleDelayNode($currentNodeInfo, $flowId, $flowHistoryId);

                        break;
                    default:
                        return false;
                }
            }
        } catch (Throwable $th) {
            $logInstance = LogManager::getInstance();
            $errorMessage = $th->getMessage();
            $lineNumber = $th->getLine();
            $fileName = $th->getFile();

            $logInstance->addLog(
                [
                    'flow_history_id' => $flowHistoryId,
                    'node_id'         => $currentNode->id,
                    'status'          => 'error',
                    'input'           => null,
                    'output'          => wp_json_encode([
                        'line_number' => $lineNumber,
                        'file_name'   => $fileName,
                        'message'     => $errorMessage
                    ]),
                    'details' => null,
                ]
            );

            return false;
        }
    }

    /**
     * Complete
     *
     * Override if applicable, but ensure that the below actions are
     * performed, or, call parent::complete().
     */
    protected function complete()
    {
        parent::complete();

        $flowId = $this->getFlowId();
        // $flowHistoryId = $this->getFlowHistoryId();
        $logs = LogManager::getLogs();
        LogService::save($logs);

        if ($this->getListenerType() === 2) {
            FlowModel::findOne(['id' => $flowId])->update(
                [
                    'listener_type'   => FlowModel::listenerType['NONE'],
                    'is_hook_capture' => FlowModel::isHookCaptured
                ]
            )->save();

            $variables = GlobalNodeVariables::getVariables();

            NodeExecutorService::saveNodeVariables($this->getFlowId(), $variables);
        }
    }

    protected function handleTaskTimeout()
    {
        $logs = LogManager::getLogs();
        LogService::save($logs);
    }
}
