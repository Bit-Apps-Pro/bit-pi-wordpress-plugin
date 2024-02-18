<?php

namespace BitApps\Pi\Services;

use BitApps\Pi\Helpers\FieldManipulation;
use BitApps\Pi\Services\Functions\Arr;
use BitApps\Pi\Services\Functions\Date;
use BitApps\Pi\Services\Functions\Math;
use BitApps\Pi\Services\Functions\Str;

class FunctionExecutor
{
    use Str, Math, Arr, Date;

    /**
     * Function parseAndExecuteTree
     *
     * @param array $tree
     *
     * @return string
     */
    public static function parseAndExecuteTree($tree)
    {
        $functionExecutorInstance = new self();

        if (\is_array($tree) && !isset($tree['type'])) {
            if ($functionExecutorInstance->isAllStrings($tree)) {
                return implode('', $tree);
            }

            $ar = array_map(function ($itm) {
                return (new self())->parseAndExecuteTree($itm);
            }, $tree);

            return array_map(function ($itm) {
                return \is_array($itm) ? implode('', $itm) : $itm;
            }, $ar);
        }

        $type = $tree['type'] ?? '';
        $value = $tree['value'] ?? '';
        $slug = $tree['slug'] ?? '';
        $args = $tree['args'] ?? [];

        if ($type === 'function') {
            if ($functionExecutorInstance->isAllStrings($args)) {
                return $functionExecutorInstance->execute($slug, $args);
            }

            $ars = $functionExecutorInstance->parseAndExecuteTree($args);

            return $functionExecutorInstance->execute($slug, $ars);
        }

        if ($type === 'variable') {
            global $nodeVariablesById;
            $platformValues = !empty($nodeVariablesById[$tree['nodeId']]) ? $nodeVariablesById[$tree['nodeId']] : [];

            if (!empty($platformValues)) {
                $pathValue = FieldManipulation::getValueFromPath($platformValues, $tree['path']);

                return !\is_array($pathValue) ? $pathValue : '';
            }
        }

        if ($type === 'string' || $type === 'operator') {
            return $value;
        }
    }

    /**
     * Function check if all array items are string
     *
     * @param array $arr
     *
     * @return bool
     */
    private function isAllStrings($arr)
    {
        return array_reduce($arr, function ($acc, $itm) {
            return $acc && \is_string($itm);
        }, true);
    }

    /**
     * Function execute
     *
     * @param string $name
     * @param array  $params
     *
     * @return string
     */
    private function execute($name, $params)
    {
        switch ($name) {
            case 'uppercase':
                return $this->uppercase($params);
            case 'lowercase':
                return $this->lowercase($params);
            case 'capitalize':
                return $this->capitalize($params);
            case 'trim':
                return $this->trim($params);
            case 'concat':
                return $this->concat($params);
            case 'str_contains':
                return $this->strContains($params);
            case 'striphtml':
                return $this->stripHtml($params);
            case 'md5':
                return $this->md5($params);
            case 'escapehtml':
                return $this->escapeHtml($params);
            case 'strlength':
                return $this->strLength($params);
            case 'replace':
                return $this->replace($params);
            case 'camecase':
                return $this->camelCase($params);
            case 'startcase':
                return $this->startCase($params);
            case 'average':
                return $this->average($params);
            case 'floor':
                return $this->floor($params);
            case 'min':
                return $this->min($params);
            case 'max':
                return $this->max($params);
            case 'round':
                return $this->round($params);
            case 'sum':
                return $this->sum($params);
            case 'join':
                return $this->join($params);
            case 'marge':
                return $this->marge($params);
            case 'arr_first_element':
                return $this->arrFirstElement($params);
            case 'arr_last_element':
                return $this->arrLastElement($params);
            case 'add_days':
                return $this->addDays($params);
            case 'add_months':
                return $this->addMonths($params);
            case 'add_years':
                return $this->addYears($params);
            case 'add_minutes':
                return $this->addMinutes($params);
            case 'date_formate':
                return $this->dateFormate($params);

            default:
                return '';
        }
    }
}
