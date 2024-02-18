<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\Deps\BitApps\WPKit\Helpers\JSON;
use BitApps\Pi\Deps\BitApps\WPKit\Http\Request\Request;
use BitApps\Pi\Deps\BitApps\WPKit\Http\Response;
use BitApps\Pi\Model\Flow;
use BitApps\Pi\Model\FlowNode;
use BitApps\Pi\Model\Webhook;
use BitApps\Pi\Services\Flow\FlowExecutor;

final class WebhookDispatchController
{
    /**
     * Get webhook latest response
     *
     * @param Request $request
     *
     * @return collection webhook response
     */
    public function captureWebhookResponse(Request $request)
    {
        $validated = $request->validate([
            'flow_id'       => ['required', 'integer'],
            'node_id'       => ['required', 'string', 'sanitize:text'],
            'listener_type' => ['required', 'string', 'sanitize:text']
        ]);

        $flow = Flow::where('id', $validated['flow_id'])->first();

        if (!$flow) {
            return Response::error('Flow does not exist');
        }

        if ($flow->listener_type === Flow::listenerType['NONE']) {
            $flow->listener_type = $validated['listener_type'] === 'CAPTURE' ? Flow::listenerType['CAPTURE'] : Flow::listenerType['RUN_ONCE'];
            $save = $flow->save();

            if (!$save) {
                return Response::error('Error updating flow');
            }
        }

        if ($flow->is_hook_capture !== Flow::isHookCaptured) {
            return Response::success(false);
        }

        $updateHookCaptureStatus = Flow::where('id', $request->flow_id)->first();
        $updateHookCaptureStatus->is_hook_capture = false;
        $updateHookCaptureStatus->listener_type = Flow::listenerType['NONE'];

        if (!$updateHookCaptureStatus->save()) {
            return Response::error('Error updating flow listener status');
        }

        $variables = $this->getVariables($validated);

        return Response::success($variables);
    }

    /**
     * Capture webhook response
     *
     * @param Request $request
     *
     * @return Webhook response
     */
    public function handleWebhook(Request $request)
    {
        $validateData = $request->validate(
            [
                'trigger_id' => ['required', 'string', 'sanitize:text']
            ]
        );

        $triggerId = $validateData['trigger_id'];

        if (!wp_is_uuid($triggerId)) {
            return Response::error('Invalid trigger id');
        }

        $request->__unset('trigger_id');

        $webhook = Webhook::where('webhook_slug', $triggerId)->whereNotNull('flow_id')->first();

        if (!$webhook) {
            return Response::error('Webhook not found');
        }

        $flow = Flow::select(['id', 'title', 'is_active', 'map', 'trigger_type', 'listener_type', 'is_hook_capture'])->where('id', $webhook->flow_id)->first();

        if (!$flow) {
            return Response::error('Flow does not exist');
        }

        if ($flow->is_hook_capture === Flow::listenerType['NONE'] && $flow->is_active === FLow::status['IN_ACTIVE']) {
            return Response::success('Sorry, the requested action cannot be performed because the flow is currently inactive.');
        }

        FlowExecutor::execute($flow, $request->all());

        return Response::success('Accepted');
    }

    public function stopHookListener(Request $request)
    {
        $validated = $request->validate([
            'flowId' => ['required', 'integer']
        ]);

        Flow::findOne(['id' => $validated['flowId']])
            ->update([
                'listener_type' => Flow::listenerType['NONE'],
            ])->save();

        return Response::success('listener stopped');
    }

    private function getVariables($data)
    {
        $response = false;
        $listenerType = $data['listener_type'];

        $query = FlowNode::select('node_id', 'variables')->where('flow_id', $data['flow_id']);

        if ($listenerType === 'CAPTURE') {
            $response = $query->where('node_id', $data['node_id'])->first();
        } elseif ($listenerType === 'RUN_ONCE') {
            $response = $query->get();
        }

        return JSON::maybeDecode($response);
    }
}
