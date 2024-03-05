<?php

namespace BitApps\Pi\Services;

use BitApps\Pi\Model\Flow;
use BitApps\Pi\Model\FlowNode;
use BitApps\WPKit\Helpers\JSON;
use Exception;
use Throwable;

class FlowImportExportService
{
    private $flowId;

    public function processImport($flowId, $data)
    {
        $this->flowId = $flowId;

        $data['map'] = preg_replace_callback('/("|\')\d+-\d+("|\')/', [$this, 'replaceNodeIdWithFlowId'], JSON::maybeEncode($data['map']));
        $data['data'] = preg_replace_callback('/("|\')\d+-\d+("|\')/', [$this, 'replaceNodeIdWithFlowId'], JSON::maybeEncode($data['data']));

        $flowUpdate = Flow::findOne(['id' => $flowId])->update($data)->save();

        $nodesDelete = FlowNode::where('flow_id', $flowId)->delete();

        $nodes = array_map(function ($node) use ($flowId) {
            unset($node['id'], $node['created_at'], $node['updated_at']);

            $node['flow_id'] = $flowId;
            $node['node_id'] = preg_replace('/\d+/', $flowId, $node['node_id'], 1);
            $node['field_mapping'] = JSON::maybeEncode($node['field_mapping']);
            $node['data'] = JSON::maybeEncode($node['data']);
            $node['variables'] = JSON::maybeEncode($node['variables']);

            return $node;
        }, $data['nodes']);

        $nodesInsert = FlowNode::insert($nodes);

        return ! (!$flowUpdate || !\is_array($nodesDelete) || !$nodesInsert);
    }

    public function importFlow($flowId, $data)
    {
        Flow::startTransaction();
        FlowNode::startTransaction();

        try {
            if (!$this->processImport($flowId, $data)) {
                throw new Exception('Flow import failed.');
            }

            Flow::commit();
            FlowNode::commit();

            return true;
        } catch (Throwable $th) {
            Flow::rollback();
            FlowNode::rollback();

            return false;
        }
    }

    public function downloadAsFile($data)
    {
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment; filename="flow_blueprint.json"');
        header('Content-Description: File Transfer');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');
        header('Content-Length: ' . \strlen(JSON::maybeEncode($data)));
        header('Content-Transfer-Encoding: binary ');
        flush();
        echo esc_html(JSON::maybeEncode($data));
        exit;
    }

    private function replaceNodeIdWithFlowId($matches)
    {
        return preg_replace('/\d+/', $this->flowId, $matches[0], 1);
    }
}
