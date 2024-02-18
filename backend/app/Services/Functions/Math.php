<?php

namespace BitApps\Pi\Services\Functions;

trait Math
{
    public function average($numbers)
    {
        $numbers = \is_string($numbers) ? explode(',', $numbers) : $numbers;

        return array_sum($numbers) / \count($numbers);
    }

    public function ceil($number)
    {
        if (!is_numeric($number)) {
            return 0;
        }

        return floor($number);
    }

    public function floor($number)
    {
        if (!is_numeric($number)) {
            return 0;
        }

        return floor($number);
    }

    public function min($numbers)
    {
        $numbers = \is_string($numbers) ? explode(',', $numbers) : $numbers;

        return min($numbers);
    }

    public function max($numbers)
    {
        $numbers = \is_string($numbers) ? explode(',', $numbers) : $numbers;

        return max($numbers);
    }

    public function round($number)
    {
        if (!is_numeric($number)) {
            return 0;
        }

        return round($number);
    }

    public function sum($args)
    {
        // $numbers = \is_string($numbers) ? explode(',', $numbers) : $numbers;

        // return array_sum($numbers);
        $operator = ['+', '-', '*', '/'];
        $result = 0;
        $op = '';
        foreach ($args as $key => $arg) {
            if (\in_array($arg, $operator)) {
                $op = $arg;

                continue;
            }
            if ($op === '') {
                $result = $arg;
            } else {
                switch ($op) {
                    case '+':
                        $result = $result + $arg;

                        break;
                    case '-':
                        $result = $result - $arg;

                        break;
                    case '*':
                        $result = $result * $arg;

                        break;
                    case '/':
                        $result = $result / $arg;

                        break;
                }
            }
        }

        return $result;
    }

    public function parseNumber($numbers)
    {
        return \floatval($numbers);
    }

    public function formatNumber($numbers)
    {
        return number_format($numbers);
    }
}
