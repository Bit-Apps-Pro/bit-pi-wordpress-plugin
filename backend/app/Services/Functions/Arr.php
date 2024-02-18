<?php

namespace BitApps\Pi\Services\Functions;

trait Arr
{
    public function length($values)
    {
        return \count($values);
    }

    public function join($values, $separator = ',')
    {
        return implode($separator, $values);
    }

    public function marge()
    {
        $arg = \func_get_args();

        return array_merge(...$arg);
    }

    // public function arrContains($values)
    // {
    //      return in_array($value, $values);
    // }

    public function arrFirstElement($values)
    {
        return reset($values);
    }

    public function arrLastElement($values)
    {
        return end($values);
    }
}
