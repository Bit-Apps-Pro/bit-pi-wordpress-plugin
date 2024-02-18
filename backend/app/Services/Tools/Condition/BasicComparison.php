<?php

namespace BitApps\Pi\Services\Tools\Condition;

class BasicComparison
{
    public function compare($comparisonOperator, $leftValue, $rightValue)
    {
        switch ($comparisonOperator) {
            case 'empty':
                return $this->isEmpty($leftValue);
            case 'not-empty':
                return !$this->isEmpty($leftValue);
            default:
                return false;
        }
    }

    public function isEmpty($leftValue)
    {
        return empty($leftValue) && !is_numeric($leftValue);
    }
}
