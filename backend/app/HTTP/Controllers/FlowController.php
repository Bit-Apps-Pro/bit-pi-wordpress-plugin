<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\Helpers\Parser;
use BitApps\Pi\HTTP\Requests\FlowRequests;
use BitApps\Pi\HTTP\Requests\FlowStoreRequest;
use BitApps\Pi\HTTP\Requests\FlowUpdateRequest;
use BitApps\Pi\Model\Flow;
use BitApps\Pi\Model\FlowNode;
use BitApps\Pi\Services\Flow\FlowExecutor;
use BitApps\Pi\Services\FlowService;
use BitApps\WPKit\Helpers\Arr;
use BitApps\WPKit\Helpers\JSON;
use BitApps\WPKit\Http\Request\Request;
use BitApps\WPKit\Http\Response;
use WP_Error;

final class FlowController
{
    public function store(FlowStoreRequest $request)
    {
        $validatedData = $request->validated();
        $flowService = new FlowService();
        $status = $flowService->save($validatedData);

        if (!$status) {
            return new WP_Error('bit_pi:invalid:flow_data', $validatedData);
        }

        return $status;
    }

    public function show(FlowRequests $request)
    {
        $validatedData = $request->validated();

        $flow = Flow::select(['id', 'title', 'map', 'data'])
            ->with('nodes', function ($query) {
                $query->select(['id', 'node_id', 'app_slug', 'machine_slug', 'machine_label', 'flow_id', "IF(`app_slug` = 'tools', `data`, null) as data"]);
            })
            ->findOne(['id' => $validatedData['flow_id']]);

        if (!$flow) {
            return Response::error('Flow not found');
        }

        return Response::success($flow);
    }

    public function search(Request $request)
    {
        $validatedData = $request->validate([
            'searchKeyValue.title' => ['nullable', 'string'],
            'searchKeyValue.tags'  => ['nullable', 'array'],
            'pageNo'               => ['required', 'integer'],
            'limit'                => ['required', 'integer'],
        ]);

        $tags = $validatedData['searchKeyValue']['tags'];
        $title = strtolower($validatedData['searchKeyValue']['title']);
        $pageNo = $validatedData['pageNo'];
        $limit = $validatedData['limit'];
        $skip = ($pageNo * $limit) - $limit;

        $flowsQuery = Flow::with('nodesCount')->with('nodes', function ($query) {
            $query->where('app_slug', '!=', 'tools')
                ->select(['flow_id', 'app_slug']);
        });

        if (\count($tags) > 0) {
            $i = -1;
            foreach ($tags as $tag) {
                $i++;
                $finInSet = "FIND_IN_SET('" . $tag . "', tag_id )";
                if ($i === 0) {
                    $flowsQuery = $flowsQuery->whereRaw($finInSet);

                    continue;
                }
                $flowsQuery = $flowsQuery->orWhereRaw($finInSet);
            }
        }

        if ($title !== '') {
            $flowsQuery->where('title', 'LIKE', '%' . $title . '%');
        }

        $totalFlows = $flowsQuery->count();
        $flows = $flowsQuery->skip($skip)->take($limit)
            ->select(['id', 'title', 'run_count', 'is_active', 'tag_id'])->get();

        if (\is_array($flows)) {
            array_map(function ($flow) {
                $flow->nodesCount = $flow->nodesCount[0]['count'] ?? 0;

                $flow->nodes = \is_array($flow->nodes) ? Arr::pluck($flow->nodes, 'app_slug') : [];
            }, $flows);
        }

        return ['flows' => $flows, 'totalFetchedFlow' => (int) $totalFlows];
    }

    public function update(FlowUpdateRequest $request)
    {
        $validatedData = $request->validated();

        $tag = $validatedData['tag'] ?? null;
        $flow = $validatedData['flow'];

        $prepareFlowTagId = $tag['oldTags'] ?? [];

        $editedFlowField = [];
        $getInsertedLastTags = [];

        if ($flow && \count($flow) > 0) {
            foreach ($flow as $key => $value) {
                if ($key === 'triggerType') {
                    $editedFlowField['trigger_type'] = Flow::triggerType[$value];

                    continue;
                }

                $editedFlowField[$key] = $value;
            }
        }

        if ($tag) {
            $editedFlowField['tag_id'] = $prepareFlowTagId;
        }

        if ($tag && \count($tag['newTags']) > 0) {
            $flowService = new FlowService();
            $getInsertedNewTag = $flowService->insertNewTag($tag);
            if (\array_key_exists('validation', $getInsertedNewTag) && $getInsertedNewTag['validation'] === false) {
                return Response::error($getInsertedNewTag['errors']);
            }
            $prepareFlowTagId = ltrim($prepareFlowTagId . ',' . $getInsertedNewTag['tag_ids'], ',');
            $editedFlowField['tag_id'] = $prepareFlowTagId;

            $getInsertedLastTags = $getInsertedNewTag['getLastInsertedTags'];
        }

        $getFlow = Flow::take(1)->find(['id' => $validatedData['id']]);
        $getFlow->update($editedFlowField);
        $getFlow->save();

        if (\count($getInsertedLastTags) > 0) {
            return ['flowDetails' => $getFlow, 'insertedNewTags' => $getInsertedLastTags];
        }

        return Response::success($getFlow);
    }

    public function destroy(Request $request)
    {
        $getFlow = new Flow($request->id);
        $getFlow->delete();

        return Response::success('Flow deleted successfully');
    }

    /**
     * Re-execute flow
     *
     * @param Request $request
     *
     * @return Response
     */
    public function reExecuteFlow(Request $request)
    {
        $flow = Flow::select(['map', 'listener_type', 'is_hook_capture', 'is_active', 'id'])->with('nodes', function ($query) {
            $query->select(['node_id', 'field_mapping', 'app_slug', 'machine_slug', 'variables', 'flow_id']);
        })->findOne(['id' => $request->flow_id]);

        if (!$flow) {
            return Response::error('Flow not found');
        }

        if (empty($flow->nodes)) {
            return Response::error('Flow nodes not found');
        }

        $triggerData = Parser::parseArrayStructure(JSON::maybeDecode($flow->nodes[0]->variables));

        FlowExecutor::execute($flow, $triggerData);

        return Response::success('Flow executed successfully');
    }

    public function variables($flow_id)
    {
        $nodes = FlowNode::where('flow_id', $flow_id)->get(['node_id', 'variables']);

        if (\is_array($nodes)) {
            $nodes = array_filter($nodes, function ($node) {
                return ! (\is_null($node->variables) || (\is_array($node->variables) && \count($node->variables) === 0));
            });

            return Response::success([...$nodes]);
        }

        return Response::success([]);
    }
}
