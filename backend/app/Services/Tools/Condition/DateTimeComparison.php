<?php

namespace BitApps\Pi\Services\Tools\Condition;

class DateTimeComparison
{
    public function compare($comparisonOperator, $leftValue, $rightValue)
    {
        switch ($comparisonOperator) {
            case 'datetime:equal':
                return $this->equal($leftValue, $rightValue);
            case 'datetime:not-equal':
                return !$this->equal($leftValue, $rightValue);
            case 'datetime:later':
                return $this->later($leftValue, $rightValue);
            case 'datetime:earlier':
                return $this->earlier($leftValue, $rightValue);
            case 'datetime:later-equal':
                return $this->laterEqual($leftValue, $rightValue);
            case 'datetime:earlier-equal':
                return $this->earlierEqual($leftValue, $rightValue);
            default:
                return false;
        }
    }

    public function equal($leftValue, $rightValue)
    {
        if (!$this->checkValidDateTime($leftValue, $rightValue)) {
            return false;
        }

        return strtotime($leftValue) === strtotime($rightValue);
    }

    public function later($leftValue, $rightValue)
    {
        if (!$this->checkValidDateTime($leftValue, $rightValue)) {
            return false;
        }

        return strtotime($leftValue) > strtotime($rightValue);
    }

    public function earlier($leftValue, $rightValue)
    {
        if (!$this->checkValidDateTime($leftValue, $rightValue)) {
            return false;
        }

        return strtotime($leftValue) < strtotime($rightValue);
    }

    public function laterEqual($leftValue, $rightValue)
    {
        if (!$this->checkValidDateTime($leftValue, $rightValue)) {
            return false;
        }

        return strtotime($leftValue) >= strtotime($rightValue);
    }

    public function earlierEqual($leftValue, $rightValue)
    {
        return strtotime($leftValue) <= strtotime($rightValue);
    }

    public function checkValidDateTime($leftValue, $rightValue)
    {
        return ! (strtotime($leftValue) === false || strtotime($leftValue) === false);
    }
}
