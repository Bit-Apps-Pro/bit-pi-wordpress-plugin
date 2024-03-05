<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\Config;
use BitApps\Pi\HTTP\Requests\WebhookIndexRequest;
use BitApps\Pi\HTTP\Requests\WebhookRequest;
use BitApps\Pi\HTTP\Requests\WebhookUpdateRequest;
use BitApps\Pi\Model\Webhook;
use BitApps\WPKit\Http\Response;

final class WebhookController
{
    private $webhookPrefix;

    public function __construct()
    {
        $this->webhookPrefix = Config::get('API_URL')['base'] . '/webhook/callback/';
    }

    /**
     * Get all webhooks
     *
     * @return array webhooks
     */
    public function index(WebhookIndexRequest $request)
    {
        $validated = $request->validated();
        $query = Webhook::select(['id', 'title', 'app_slug', 'webhook_slug']);

        if (isset($validated['flowId'])) {
            $query->where('flow_id', $validated['flowId'])->orWhere('flow_id', null);
        }
        if (isset($validated['appSlug'])) {
            $query->where('app_slug', $validated['appSlug']);
        }

        $webhooks = $query->get();

        if (\is_array($webhooks)) {
            array_map(function ($webhook) {
                $webhook->url = $this->webhookPrefix . $webhook->webhook_slug;

                return $webhook;
            }, $webhooks);
        }

        return Response::success($webhooks);
    }

    /**
     * Store webhook
     *
     * @param WebhookRequest $request
     *
     * @return collection webhook
     */
    public function store(WebhookRequest $request)
    {
        $table = Config::get('WP_DB_PREFIX') . Config::VAR_PREFIX . 'webhooks';
        $validated = $request->validated();

        // TODO: replace raw query if possible
        Webhook::raw('UPDATE ' . $table . ' SET flow_id = null WHERE flow_id = %d', $validated['flow_id']);

        $webhookSlug = wp_generate_uuid4();

        $insert = Webhook::insert([
            'title'        => $validated['title'],
            'app_slug'     => $validated['app_slug'],
            'flow_id'      => $validated['flow_id'],
            'webhook_slug' => $webhookSlug
        ]);

        if (!$insert) {
            return Response::error('Error creating webhook');
        }

        return Response::success([
            'id'           => $insert->id,
            'title'        => $validated['title'],
            'app_slug'     => $insert->app_slug,
            'webhook_slug' => $webhookSlug,
            'url'          => $this->webhookPrefix . $webhookSlug,
        ]);
    }

    /**
     * Update webhook
     *
     * @param Webhook $request
     *
     * @return int webhook id
     */
    public function update(WebhookUpdateRequest $request, Webhook $webhook)
    {
        $validated = $request->validated();

        $table = Config::get('WP_DB_PREFIX') . Config::VAR_PREFIX . 'webhooks';

        // TODO: replace raw query if possible
        Webhook::raw('UPDATE ' . $table . ' SET flow_id = null WHERE flow_id = %d', $validated['flow_id']);

        $webhook->update(['flow_id' => $validated['flow_id']])->save();

        return Response::success(['id' => $webhook->id]);
    }

    /**
     * Destroy webhook
     *
     * @param Webhook $request
     *
     * @return int webhook id
     */
    public function destroy(Webhook $webhook)
    {
        $webhook->delete();

        return Response::success($webhook->id);
    }
}
