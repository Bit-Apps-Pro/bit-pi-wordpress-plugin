<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\Pi\Rules\FlowExists;
use BitApps\WPKit\Http\Request\Request;

class FlowRequests extends Request
{
    public function rules()
    {
        return [
            'flow_id' => ['required', 'numeric', new FlowExists()],
        ];
    }
}
