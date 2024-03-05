<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\Helpers\Hash;
use BitApps\Pi\HTTP\Requests\ProxyRequest;
use BitApps\WPKit\Http\Client\HttpClient;
use BitApps\WPKit\Http\Response;

final class CommonController
{
    /**
     * Fetch proxy url data.
     *
     * @param ProxyRequest $request
     *
     * @return Response
     */
    public function fetchProxyUrlData(ProxyRequest $request)
    {
        $url = $request['url'];
        $method = strtoupper($request['method']);
        $headers = $request->get('headers', null);
        $queryParams = $request->get('queryParams', null);
        $bodyParams = $method === 'POST' ? $request->get('bodyParams', []) : [];
        $encrypted = $request->get('encrypted', []);

        if (\count($encrypted) > 0) {
            foreach ($encrypted as $value) {
                $arr = explode('.', $value);
                ${$arr[0]}[$arr[1]][$arr[2]] = Hash::decrypt(${$arr[0]}[$arr[1]][$arr[2]]);
                ${$arr[0]}[$arr[1]] = implode('', ${$arr[0]}[$arr[1]]);
            }
        }

        if (!\is_null($queryParams)) {
            $url .= '?' . http_build_query($queryParams);
        }

        $http = new HttpClient();
        $response = $http->request($url, $method, $bodyParams, $headers);

        if (is_wp_error($response)) {
            return Response::error('Something went wrong');
        }

        return Response::success($response);
    }
}
