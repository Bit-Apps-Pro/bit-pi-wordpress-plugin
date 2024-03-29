<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\WPKit\Http\Request\Request;

class NodeStoreRequest extends Request
{
    public function rules()
    {
        return [
            'flow_id'       => ['required', 'numeric'],
            'node_id'       => ['required', 'string', 'sanitize:text'],
            'app_slug'      => ['nullable', 'string', 'sanitize:text'],
            'machine_slug'  => ['nullable', 'string', 'sanitize:text'],
            'machine_label' => ['nullable', 'string', 'sanitize:text'],
            'field_mapping' => ['nullable', 'array'],
            'data'          => ['nullable', 'array'],
        ];
    }
}
