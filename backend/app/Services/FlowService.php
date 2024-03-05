<?php

namespace BitApps\Pi\Services;

use BitApps\Pi\Config;
use BitApps\Pi\Model\Flow;
use BitApps\Pi\Model\FlowNode;
use BitApps\Pi\Model\Tag;
use BitApps\WPKit\Helpers\Arr;
use BitApps\WPKit\Helpers\JSON;

class FlowService
{
    public function save($flowData)
    {
        $flow = Flow::insert($flowData);

        $newFlow = [
            'map'  => $flow['map'],
            'data' => $flow['data'],
        ];

        $newFlow['map']->id = $flow->id . '-1';
        $newFlow['data']->nodes[0]['id'] = $flow->id . '-1';

        $updatedFlow = Flow::findOne(['id' => $flow->id]);
        $updatedFlow->update($newFlow);

        return $updatedFlow->save() ? $updatedFlow : false;
    }

    public function insertNewTag($tagData)
    {
        $newTags = $tagData['newTags'];
        $prepareFlowTagId = '';

        $getLastInsertedTags = Tag::insert($newTags);

        foreach ($getLastInsertedTags as $tagId) {
            $prepareFlowTagId .= $tagId['id'] . ',';
        }

        return ['getLastInsertedTags' => $getLastInsertedTags, 'tag_ids' => rtrim($prepareFlowTagId, ',')];
    }

    public static function exists($appSlug, $machineSlug, $flowColumns = ['*'], $nodeColumns = ['*'])
    {
        $flowIds = FlowNode::where('app_slug', $appSlug)->where('machine_slug', $machineSlug)->get(['flow_id']);
        $flowIdsArr = \is_array($flowIds) ? Arr::pluck($flowIds, 'flow_id') : [];

        if (\count($flowIdsArr) === 0) {
            return false;
        }

        return Flow::select($flowColumns)
            ->whereIn('id', $flowIdsArr)
            ->with('nodes', function ($query) use ($nodeColumns) {
                $query->select($nodeColumns);
            })
            ->get();
    }

    public static function captureStatusUpdate($flowId, $status)
    {
        $flow = Flow::findOne(['id' => $flowId]);

        $flow->is_hook_capture = $status;

        return $flow->save() ? $flow : false;
    }

    public static function saveExecutedNodeIds($flowId, $executedNodeIds)
    {
        $flow = Flow::findOne(['id' => $flowId]);

        $flow->executed_node_ids = $executedNodeIds;

        return $flow->save() ? $flow : false;
    }

    public static function getAppSettings()
    {
        $settings = Config::getOption('app_settings');

        return JSON::maybeDecode($settings);
    }
}
