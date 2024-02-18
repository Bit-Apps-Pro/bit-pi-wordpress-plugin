<?php

namespace BitApps\Pi\Services\Tools\Condition;

class NumericComparison
{
    public function compare($comparisonOperator, $leftValue, $rightValue)
    {
        switch ($comparisonOperator) {
            case 'greater-than':
                return $this->isGreaterThan($leftValue, $rightValue);
            case 'less-than':
                return $this->isLessThan($leftValue, $rightValue);
            case 'greater-than-equal':
                return $this->isGreaterThanOrEqual($leftValue, $rightValue);
            case 'less-than-equal':
                return $this->isLessThanOrEqual($leftValue, $rightValue);
            default:
                return false;
        }
    }

    public function equal($leftValue, $rightValue)
    {
        if (!$this->isNumeric($leftValue, $rightValue)) {
            return false;
        }

        return $leftValue == $rightValue;
    }

    public function isGreaterThan($leftValue, $rightValue)
    {
        if (!$this->isNumeric($leftValue, $rightValue)) {
            return false;
        }

        return $leftValue > $rightValue;
    }

    public function isLessThan($leftValue, $rightValue)
    {
        if (!$this->isNumeric($leftValue, $rightValue)) {
            return false;
        }

        return $leftValue < $rightValue;
    }

    public function isGreaterThanOrEqual($leftValue, $rightValue)
    {
        if (!$this->isNumeric($leftValue, $rightValue)) {
            return false;
        }

        return $leftValue >= $rightValue;
    }

    public function isLessThanOrEqual($leftValue, $rightValue)
    {
        if (!$this->isNumeric($leftValue, $rightValue)) {
            return false;
        }

        return $leftValue <= $rightValue;
    }

    public function isNumeric($leftValue, $rightValue)
    {
        return ! (!is_numeric($leftValue) || !is_numeric($rightValue));
    }
}
