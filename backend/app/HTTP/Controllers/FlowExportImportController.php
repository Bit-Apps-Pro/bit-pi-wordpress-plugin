<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\Model\Flow;
use BitApps\Pi\Services\FlowImportExportService;
use BitApps\WPKit\Http\Request\Request;
use BitApps\WPKit\Http\Response;

class FlowExportImportController
{
    public function getExportData($flowId)
    {
        return Flow::with('nodes')->findOne(['id' => $flowId]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'flow_id' => ['required', 'integer'],
        ]);

        $exportData = $this->getExportData($request->flow_id);

        $exportService = new FlowImportExportService();
        $exportService->downloadAsFile($exportData);
    }

    public function import(Request $request)
    {
        $request->validate([
            'flow_id' => ['required', 'integer'],
        ]);

        $flowId = $request['flow_id'];
        $file = $request->files()['flow_blueprint'];

        if (!is_file($file['tmp_name']) || $file['type'] !== 'application/json' || $file['error'] !== UPLOAD_ERR_OK) {
            return Response::error(['message' => 'Invalid file type. only json file is allowed.']);
        }

        $data = json_decode(html_entity_decode(file_get_contents($file['tmp_name'])), true);

        $importService = new FlowImportExportService();
        $isImported = $importService->importFlow($flowId, $data);

        if (!$isImported) {
            return Response::error(['message' => 'Flow import failed! make sure that, the json file is valid blueprint.']);
        }

        return Response::success(['message' => 'Flow imported successfully.']);
    }
}
