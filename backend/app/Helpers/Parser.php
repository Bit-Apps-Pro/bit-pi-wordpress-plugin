<?php

namespace BitApps\Pi\Helpers;

if (!\defined('ABSPATH')) {
    exit;
}

class Parser
{
    /**
     * Parses a response array into a structured format.
     *
     * @param array $response The response array to parse.
     * @param bool  $isFile   Whether the response contains file data.
     *
     * @return array The parsed response.
     */
    public static function parseResponse($response, $isFile = false)
    {
        $parsed = [];

        foreach ($response as $key => $value) {
            if (\is_array($value) || \is_object($value)) {
                if (static::isMultiDimensionArray($value)) {
                    $parsed[] = [
                        'key'   => $key,
                        'type'  => 'array',
                        'value' => static::parseResponse($value[0] ?? $value, $isFile),
                    ];
                } else {
                    $parsed[] = [
                        'key'   => $key,
                        'type'  => 'collection',
                        'value' => static::parseResponse($value, $isFile),
                    ];
                }
            } else {
                if ($isFile && $key === 'tmp_name') {
                    $parsed[] = [
                        'key'   => $key,
                        'type'  => 'buffer',
                        'value' => file_get_contents($value),
                    ];
                } else {
                    $parsed[] = [
                        'key'   => $key,
                        'type'  => \gettype($value),
                        'value' => $value,
                    ];
                }
            }
        }

        return $parsed;
    }

    /**
     * Parses array structure.
     *
     * @param mixed $parseResponse
     */
    public static function parseArrayStructure($parseResponse)
    {
        $arrayStructure = [];

        if (!\is_array($parseResponse)) {
            return [];
        }

        foreach ($parseResponse as $response) {
            $response = (array) $response;
            if (\in_array($response['type'], ['array', 'collection'])) {
                $arrayStructure[$response['key']] = static::parseArrayStructure($response['value']);
            } else {
                $arrayStructure[$response['key']] = $response['value'];
            }
        }

        return $arrayStructure;
    }

    /**
     * Checks if the given array is a multi-dimensional array.
     *
     * @param array $data
     *
     * @return bool Whether the array is a multi-dimensional array.
     */
    private static function isMultiDimensionArray($data)
    {
        if (!\is_array($data)) {
            return false;
        }

        return !(\count($data) === \count($data, COUNT_RECURSIVE));
    }
}
