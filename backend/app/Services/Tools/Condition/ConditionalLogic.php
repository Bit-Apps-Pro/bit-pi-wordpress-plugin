<?php

namespace BitApps\Pi\Services\Tools\Condition;

use BitApps\Pi\Helpers\FieldManipulation;
use BitApps\WPKit\Helpers\JSON;

class ConditionalLogic
{
    private const LOGICAL_OPERATOR = 'logical-operator';

    private const AND_OPERATOR = 'and';

    private const OR_OPERATOR = 'or';

    private const LOGIC = 'logic';

    public function isLogicMatch($condition)
    {
        $leftExp = FieldManipulation::replaceMixTagValue(JSON::maybeDecode($condition['leftExp'], true));
        $rightExp = FieldManipulation::replaceMixTagValue(JSON::maybeDecode($condition['rightExp'], true));

        return ComparisonFactory::createComparison($leftExp, $rightExp, $condition['operator']);
    }

    public static function conditionStatus($conditions)
    {
        $conditionStatus = null;
        $operator = null;
        $conditionInstance = new self();

        foreach ($conditions as $condition) {
            $condition = (array) $condition;
            if ($condition['type'] === self::LOGIC) {
                $isLogicMatch = $conditionInstance->isLogicMatch($condition);

                if ($operator === self::AND_OPERATOR) {
                    $conditionStatus = $conditionStatus && $isLogicMatch;
                } elseif ($operator === self::OR_OPERATOR) {
                    $conditionStatus = $conditionStatus || $isLogicMatch;
                } else {
                    $conditionStatus = $isLogicMatch;
                }
            } elseif ($condition['type'] === self::LOGICAL_OPERATOR) {
                $operator = $condition['value'];
            }
        }

        return $conditionStatus;
    }
}
