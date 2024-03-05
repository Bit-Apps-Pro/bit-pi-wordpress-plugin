<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\WPKit\Http\Request\Request;

class ProxyRequest extends Request
{
    public function rules()
    {
        return [
            'url'         => ['required', 'string', 'sanitize:text'],
            'method'      => ['required', 'string', 'sanitize:text'],
            'headers'     => ['nullable'],
            'queryParams' => ['nullable'],
            'bodyParams'  => ['nullable'],
        ];
    }
}
