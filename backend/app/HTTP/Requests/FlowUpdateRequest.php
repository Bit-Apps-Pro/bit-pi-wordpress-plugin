<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\WPKit\Http\Request\Request;

class FlowUpdateRequest extends Request
{
    public function rules()
    {
        return [
            'id'   => ['required', 'integer'],
            'flow' => ['required', 'array'],
            'tag'  => ['nullable', 'array'],
        ];
    }
}
