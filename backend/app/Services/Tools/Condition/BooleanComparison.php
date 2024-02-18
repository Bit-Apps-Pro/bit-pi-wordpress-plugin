<?php

namespace BitApps\Pi\Services\Tools\Condition;

class BooleanComparison
{
    public function compare($comparisonOperator, $leftValue, $rightValue)
    {
        switch ($comparisonOperator) {
            case 'equal':
                return $this->isBoolean($leftValue, $rightValue);
            case 'not-equal':
                return !$this->isBoolean($leftValue, $rightValue);
            default:
                return false;
        }
    }

    public function isBoolean($leftValue, $rightValue)
    {
        return (bool) $leftValue === (bool) $rightValue;
    }
}
