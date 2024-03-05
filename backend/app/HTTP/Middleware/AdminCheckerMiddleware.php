<?php

namespace BitApps\Pi\HTTP\Middleware;

use BitApps\WPKit\Http\Response;
use BitApps\WPKit\Utils\Capabilities;

final class AdminCheckerMiddleware
{
    public function handle()
    {
        if (!Capabilities::check('manage_options')) {
            return Response::error('Access Denied: Only administrators are allowed to make this request')->httpStatus(411);
        }

        return true;
    }
}
