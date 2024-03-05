<?php

namespace BitApps\Pi\HTTP\Requests;

use BitApps\WPKit\Http\Request\Request;

class RefreshTokenRequest extends Request
{
    public function rules()
    {
        return [
            'connectionId' => ['required', 'integer'],
            'appSlug'      => ['required', 'string', 'sanitize:text', 'sanitize:ucfirst'],
        ];
    }
}
