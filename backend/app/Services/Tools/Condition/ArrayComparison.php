<?php

namespace BitApps\Pi\Services\Tools\Condition;

class ArrayComparison
{
    public function compare($operator, $leftValue, $rightValue)
    {
        $caseInSensitive = false;
        $operatorSplit = explode('-ci', $operator);

        if (\count($operatorSplit) === 2) {
            $caseInSensitive = true;
            $comparisonOperator = $operatorSplit[0];
        } else {
            $comparisonOperator = $operator;
        }

        switch ($comparisonOperator) {
            case 'arr-contain':
                return $this->isArrContain($leftValue, $rightValue, $caseInSensitive);
            case 'arr-not-contain':
                return !$this->isArrContain($leftValue, $rightValue, $caseInSensitive);
            case 'arr-len-equal':
                return $this->isArrLenEqual($leftValue, $rightValue);
            case 'arr-len-not-equal':
                return !$this->isArrLenEqual($leftValue, $rightValue);
            default:
                return false;
        }
    }

    public function isArrContain($leftValue, $rightValue, $caseInSensitive)
    {
        if (!$caseInSensitive) {
            return \in_array($rightValue, $leftValue);
        }

        return \in_array(strtolower($rightValue), array_map('strtolower', $leftValue));
    }

    public function isArrLenEqual($leftValue, $rightValue)
    {
        return \count($leftValue) === $rightValue;
    }

    public function arrLenNotEqual($leftValue, $rightValue)
    {
        return \count($leftValue) !== $rightValue;
    }

    public function arrLenGreaterThan($leftValue, $rightValue)
    {
        return \count($leftValue) > $rightValue;
    }

    public function arrLenLessThan($leftValue, $rightValue)
    {
        return \count($leftValue) < $rightValue;
    }

    public function arrLenGreaterThanOrEqual($leftValue, $rightValue)
    {
        return \count($leftValue) >= $rightValue;
    }

    public function arrLenLessThanOrEqual($leftValue, $rightValue)
    {
        return \count($leftValue) <= $rightValue;
    }
}
