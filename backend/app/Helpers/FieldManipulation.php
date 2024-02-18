<?php

namespace BitApps\Pi\Helpers;

use BitApps\Pi\Deps\BitApps\WPKit\Helpers\JSON;
use BitApps\Pi\Services\FunctionExecutor;
use BitApps\Pi\Services\GlobalNodeVariables;

if (!\defined('ABSPATH')) {
    exit;
}

class FieldManipulation
{
    /**
     * Gets a value from an array using a path.
     *
     * @param array  $data   The array to get the value from.
     * @param string $path   The path to the value.
     * @param mixed  $root
     * @param mixed  $method
     * @param mixed  $t
     *
     * @return mixed The value.
     */
    public static function getValueFromPath($data, $path)
    {
        if (empty($data)) {
            return $data;
        }

        if (!empty($path)) {
            $keys = explode('.', $path);

            foreach ($keys as $key) {
                $data = \is_object($data) ? (array) $data : $data;

                if (isset($data[$key])) {
                    $data = $data[$key];
                }
            }
        }

        return $data;
    }

    /**
     * Replace field with values.
     *
     * @param [type] $values
     * @param mixed $fields
     * @param mixed $MixInputValue
     * @param mixed $mixInputValue
     * @param mixed $mixedInputValue
     * @param mixed $mixedInputValues
     *
     * @return void
     */
    public static function replaceMixTagValue($mixedInputValues)
    {
        $nodeVariables = GlobalNodeVariables::getVariables();

        $parsedInputData = JSON::maybeDecode($mixedInputValues, true);

        if ($parsedInputData === null || !\is_array($parsedInputData)) {
            return $mixedInputValues;
        }

        $values = '';

        foreach ($parsedInputData as $item) {
            $item = (array) $item;
            if ($item['type'] === 'variable') {
                $platformValues = !empty($nodeVariables[$item['nodeId']]) ? $nodeVariables[$item['nodeId']] : [];

                if (!empty($platformValues)) {
                    $pathValue = static::getValueFromPath($platformValues, $item['path']);
                    $values .= !\is_array($pathValue) ? $pathValue : '';
                }
            } elseif ($item['type'] === 'string') {
                $values .= $item['value'];
            } elseif ($item['type'] === 'function') {
                $values .= FunctionExecutor::parseAndExecuteTree($item);
            }
        }

        return $values;
    }

    /**
     * Generate payload with field map.
     *
     * @param array $fieldMap
     *
     * @return array
     */
    public static function processData($fieldMap)
    {
        $payload = [];

        foreach ($fieldMap as $fieldPair) {
            $keys = explode('.', $fieldPair['path']);

            if (empty($fieldPair['value'])) {
                continue;
            }

            $mixedInputValue = static::replaceMixTagValue($fieldPair['value']);

            static::assignValueToKey($payload, $keys, $mixedInputValue);
        }

        return $payload;
    }

    public static function processRepeaters($data, $returnArrayType = null)
    {
        $output = [];
        foreach ($data as $items) {
            $itemArray = [];

            foreach ($items as $item) {
                if (isset($item['key'], $item['value'])) {
                    $itemArray[static::replaceMixTagValue($item['key'])] = static::replaceMixTagValue($item['value']);
                }
            }

            if ($returnArrayType === 'multi-array') {
                $output[] = $itemArray;
            } else {
                $output = array_merge($output, $itemArray);
            }
        }

        return $output;
    }

    public static function processConfigs($data)
    {
        // if data is string then showing warning thats why added this condition
        if (!is_iterable($data)) {
            return $data;
        }

        foreach ($data as $key => $value) {
            if (\is_array($value)) {
                $data[$key] = static::processConfigs($value);
            } else {
                $data[$key] = static::replaceMixTagValue($value);
            }
        }

        return $data;
    }

    /**
     * Assign value to key.
     *
     * @param array $payload
     * @param array $keys
     * @param mixed $value
     *
     * @return void
     */
    private static function assignValueToKey(&$payload, $keys, $value)
    {
        $currentKey = array_shift($keys);

        if (\count($keys) === 0) {
            $payload[$currentKey] = $value;
        } else {
            if (!isset($payload[$currentKey])) {
                $payload[$currentKey] = [];
            }

            static::assignValueToKey($payload[$currentKey], $keys, $value);
        }
    }
}
