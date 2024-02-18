<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\Pi\Deps\BitApps\WPKit\Http\Request\Request;
use BitApps\Pi\Rules\FlowExists;

class FlowRequests extends Request
{
    public function rules()
    {
        return [
            'flow_id' => ['required', 'numeric', new FlowExists()],
        ];
    }
}
