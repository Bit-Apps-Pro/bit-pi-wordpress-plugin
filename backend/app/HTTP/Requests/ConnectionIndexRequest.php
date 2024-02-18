<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\Pi\Deps\BitApps\WPKit\Http\Request\Request;

class ConnectionIndexRequest extends Request
{
    public function rules()
    {
        return [
            'appSlug' => ['nullable', 'string', 'sanitize:text'],
        ];
    }
}
