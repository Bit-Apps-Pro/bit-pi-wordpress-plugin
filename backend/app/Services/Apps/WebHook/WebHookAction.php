<?php

namespace BitApps\Pi\Services\Apps\WebHook;

use BitApps\Pi\Deps\BitApps\WPKit\Http\Client\HttpClient;
use BitApps\Pi\Helpers\FieldManipulation;
use BitApps\Pi\Services\FlowNode\NodeInfoProvider;
use BitApps\Pi\Services\Interfaces\ActionInterface;

class WebHookAction implements ActionInterface
{
    protected $nodeInfoProvider;

    public function __construct(NodeInfoProvider $nodeInfoProvider)
    {
        $this->nodeInfoProvider = $nodeInfoProvider;
    }

    /**
     * Execute the action
     *
     * @return array
     */
    public function execute()
    {
        $config = $this->nodeInfoProvider->getFieldMapConfigs($this->nodeInfoProvider->config(), 'properties');

        $url = empty($config->url) ? '' : $config->url;

        $method = empty($config->method) ? '' : $config->method;

        $payload = $this->nodeInfoProvider->getFieldMapRepeaters('queryParams.value');

        $response = (new HttpClient())->request($url, $method, $payload);

        if ($response->status_code !== 200) {
            return [
                'success'  => false,
                'message'  => 'Webhook failed to send',
                'response' => $response,
                'payload'  => $payload,
            ];
        }

        return [
            'success'  => true,
            'message'  => 'Webhook sent successfully',
            'response' => $response,
            'payload'  => $payload,
        ];
    }

    // TODO:: implement this function when ready frontend

    private function processHeaders($details, $boundary = null)
    {
        $headers = [];
        foreach ($headers as $keyValuePair) {
            $headers[$keyValuePair->key] = FieldManipulation::replaceMixTagValue($keyValuePair->value, $this->nodeInfoDetails->fieldMap());
        }

        if (isset($details->body->type)) {
            if ($details->body->type === 'multipart/form-data') {
                $headers['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;
            } else {
                $headers['Content-Type'] = $details->body->type;
            }
        }

        return $headers;
    }

    // TODO:: implement this function when ready frontend
    private function processPayload($details, $fieldValues, $boundary)
    {
    }
}
