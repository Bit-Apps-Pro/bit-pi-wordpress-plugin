<?php

use BitApps\Pi\HTTP\Controllers\RedirectController;
use BitApps\Pi\HTTP\Controllers\WebhookDispatchController;
use BitApps\WPKit\Http\Router\Route;

if (!defined('ABSPATH')) {
    exit;
}

Route::get('oauthCallback', [RedirectController::class, 'handleCallback']);
// Route::match(['post', 'get'],'capture/{trigger_id}',[WebhookController::class, 'captureWebhook']);
Route::match(['post', 'get'], 'webhook/callback/{trigger_id}', [WebhookDispatchController::class, 'handleWebhook']);
