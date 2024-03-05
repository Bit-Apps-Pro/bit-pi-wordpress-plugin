<?php

use BitApps\Pi\HTTP\Controllers\AuthorizationController;
use BitApps\Pi\HTTP\Controllers\CommonController;
use BitApps\Pi\HTTP\Controllers\ConnectionController;
use BitApps\Pi\HTTP\Controllers\FlowController;
use BitApps\Pi\HTTP\Controllers\FlowExportImportController;
use BitApps\Pi\HTTP\Controllers\HistoryController;
use BitApps\Pi\HTTP\Controllers\NodeController;
use BitApps\Pi\HTTP\Controllers\TagController;
use BitApps\Pi\HTTP\Controllers\WebhookController;
use BitApps\Pi\HTTP\Controllers\WebhookDispatchController;
use BitApps\Pi\Services\Flow\FlowExecutor;
use BitApps\WPKit\Http\Router\Route;

if (!defined('ABSPATH')) {
    exit;
}

if (!headers_sent()) {
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    header('Access-Control-Allow-Origin: *');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);

        exit;
    }
}

Route::noAuth()->group(function (): void {
    Route::post('proxy/route', [CommonController::class, 'fetchProxyUrlData']);
    Route::get('flows/{flow_id}', [FlowController::class, 'show']);
    Route::post('flows/save', [FlowController::class, 'store']);
    Route::post('flows/update', [FlowController::class, 'update']);
    Route::post('flows/search', [FlowController::class, 'search']);
    Route::post('flows/delete', [FlowController::class, 'destroy']);
    Route::get('flow/re-execute/{flow_id}', [FlowController::class, 'reExecuteFlow']);
    Route::get('flows/{flow_id}/variables', [FlowController::class, 'variables']);

    Route::get('flow-export/{flow_id}', [FlowExportImportController::class, 'export']);
    Route::post('flow-import/{flow_id}', [FlowExportImportController::class, 'import']);

    Route::get('node/{flow_id}/{node_id}', [NodeController::class, 'show']);
    Route::post('node/store', [NodeController::class, 'store']);
    Route::post('node/save', [NodeController::class, 'createOrUpdate']);
    Route::post('node/update', [NodeController::class, 'update']);
    Route::post('node/{node}/delete', [NodeController::class, 'destroy']);

    Route::get('tags', [TagController::class, 'index']);
    Route::post('tags/save', [TagController::class, 'store']);
    Route::post('tags/update', [TagController::class, 'update']);
    Route::post('tags/updateStatus', [TagController::class, 'updateStatus']);
    Route::post('tags/delete', [TagController::class, 'destroy']);

    // TODO:: this ajax routing working only for pro version
    Route::post('connections', [ConnectionController::class, 'index']);
    Route::post('connections/save', [ConnectionController::class, 'store']);
    Route::post('connections/{connection}/delete', [ConnectionController::class, 'destroy']);
    Route::post('refresh-token', [AuthorizationController::class, 'refreshToken']);

    Route::post('webhooks', [WebhookController::class, 'index']);
    Route::post('webhooks/save', [WebhookController::class, 'store']);
    Route::get('webhooks/{webhook}', [WebhookController::class, 'show']);
    Route::post('webhooks/{webhook}/update', [WebhookController::class, 'update']);
    Route::post('webhooks/{webhook}/delete', [WebhookController::class, 'destroy']);

    Route::get('hook-capture/{flow_id}/{node_id}', [WebhookDispatchController::class, 'captureWebhookResponse']);
    Route::post('stop-hook-listener', [WebhookDispatchController::class, 'stopHookListener']);

    Route::get('histories/{flow_id}/{page_number}/{page_limit}', [HistoryController::class, 'index']);
    Route::get('history/{history_id}', [HistoryController::class, 'show']);

    Route::post('background_process_request', [FlowExecutor::class, 'maybeHandle']);
})->middleware('nonce', 'isAdmin');
