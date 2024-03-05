<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\WPKit\Http\Request\Request;

class FlowStoreRequest extends Request
{
    public function rules()
    {
        return [
            'title'  => ['required', 'string', 'sanitize:text'],
            'map'    => ['required', 'array'],
            'data'   => ['required', 'array'],
            'tag_id' => ['nullable', 'string', 'sanitize:text']
        ];
    }
}
