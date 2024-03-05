<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\WPKit\Http\Request\Request;

class WebhookIndexRequest extends Request
{
    public function rules()
    {
        return [
            'flowId'  => ['nullable', 'integer'],
            'appSlug' => ['nullable', 'string', 'sanitize:text'],
        ];
    }
}
