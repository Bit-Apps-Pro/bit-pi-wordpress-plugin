<?php

namespace BitApps\Pi\Services\Authorization;

use BitApps\Pi\Model\Connection;
use BitApps\WPKit\Http\Client\HttpClient;

abstract class AbstractAuthorization
{
    protected $connectionId;

    protected $http;

    public function __construct($connectionId, HttpClient $http)
    {
        $this->connectionId = $connectionId;
        $this->http = $http;
    }

    abstract public function refreshToken();

    abstract public function isTokenExpired($generatedAt, $expiresIn);

    public function getConnection()
    {
        return Connection::findOne(['id' => $this->connectionId]);
    }

    public function updateConnection($connection, $newTokenDetails)
    {
        $save = $connection->update([
            'auth_details' => $newTokenDetails
        ])->save();

        if (!$save) {
            return [
                'error'   => true,
                'message' => 'connection update failed',
            ];
        }

        return $newTokenDetails;
    }

    public function getConnectionId()
    {
        return $this->connectionId;
    }
}
