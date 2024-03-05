<?php

namespace BitApps\Pi;

if (!\defined('ABSPATH')) {
    exit;
}

final class Dotenv
{
    public static function load($filePath)
    {
        if (!file_exists($filePath)) {
            return false;
        }

        $envData = file_get_contents($filePath);

        $envVariables = explode("\n", $envData);

        foreach ($envVariables as $variable) {
            if (empty($variable) || $variable[0] === '#') {
                continue;
            }

            list($key, $value) = explode('=', $variable, 2);

            $value = trim($value, " \t\n\r\0\x0B\"");
            $key = trim($key, " \t\n\r\0\x0B\"");

            if (!isset($_ENV[$key])) {
                if (\in_array($value, ['true',  '1'])) {
                    $_ENV[$key] = true;
                } elseif (\in_array($value, ['false', '0'])) {
                    $_ENV[$key] = false;
                } else {
                    $_ENV[$key] = $value;
                }
            }
        }
    }
}
