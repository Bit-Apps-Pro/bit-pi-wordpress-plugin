<?php

namespace BitApps\Pi\Services\Exception;

use Exception;

class MissingKeyException extends Exception
{
    public function __construct($code = 0, Exception $previous = null)
    {
        $message = 'Error: Missing required key {input, output, status} in the array.';

        parent::__construct($message, $code, $previous);
    }
}
