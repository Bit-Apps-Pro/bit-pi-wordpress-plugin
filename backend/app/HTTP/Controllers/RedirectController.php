<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\Deps\BitApps\WPKit\Http\Request\Request;
use WP_Error;

final class RedirectController
{
    public function handleCallback(Request $request)
    {
        $validatedData = $request->validate(
            [
                'state' => ['required', 'string', 'sanitize:text'],
            ]
        );

        $state = $validatedData['state'];
        $parsed_url = wp_parse_url(get_site_url());
        $site_url = $parsed_url['scheme'] . '://' . $parsed_url['host'];
        $site_url .= empty($parsed_url['port']) ? null : ':' . $parsed_url['port'];

        if (strpos($state, $site_url) === false) {
            return new WP_Error('404');
        }

        $params = $request->queryParams();
        unset($params['rest_route'], $params['state']);

        if (wp_redirect($state . '?&' . http_build_query($params), 302)) {
            exit;
        }
    }
}
