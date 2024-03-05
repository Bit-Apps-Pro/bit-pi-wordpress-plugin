<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\WPKit\Http\Request\Request;

class WebhookRequest extends Request
{
    public function rules()
    {
        return [
            'flow_id'  => ['required', 'integer'],
            'title'    => ['required', 'string', 'sanitize:text'],
            'app_slug' => ['required', 'string', 'sanitize:text'],
        ];
    }
}
