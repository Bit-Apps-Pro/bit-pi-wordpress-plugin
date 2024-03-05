<?php

namespace BitApps\Pi\HTTP\Controllers;

use BitApps\Pi\HTTP\Requests\RefreshTokenRequest;
use BitApps\WPKit\Http\Client\HttpClient;
use BitApps\WPKit\Http\Response;

final class AuthorizationController
{
    public function refreshToken(RefreshTokenRequest $request)
    {
        $validatedData = $request->validated();
        $appSlug = $validatedData['appSlug'];

        $class = $this->doesAuthorizationClassExist($appSlug);

        if ($class) {
            $response = (object) (new $class($request['connectionId'], new HttpClient()))->refreshToken();

            if (!isset($response->error)) {
                return Response::success($response);
            }

            return Response::error($response);
        }

        return Response::error("{$appSlug}AuthorizationHandler class not found");
    }

    private function doesAuthorizationClassExist($appSlug)
    {
        $class = 'BitApps\Pi\Services\Apps\\' . $appSlug . '\\' . $appSlug . 'AuthorizationHandler';

        if (class_exists($class)) {
            return $class;
        } elseif ("BitApps\PiPro\Services\Apps\\{$appSlug}\\{$appSlug}AuthorizationHandler") {
            return "BitApps\PiPro\Services\Apps\\{$appSlug}\\{$appSlug}AuthorizationHandler";
        }

        return false;
    }
}
