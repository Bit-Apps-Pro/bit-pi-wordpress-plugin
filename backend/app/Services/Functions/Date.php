<?php

namespace BitApps\Pi\Services\Functions;

trait Date
{
    public function dateFormate($params)
    {
        if (!empty($params[0]) && !empty($params[1])) {
            $date = $params[0];
            $format = $params[1];

            return gmdate($format, strtotime($date));
        }

        return false;
    }

    public function addDays($params)
    {
        if (!empty($params[0]) && !empty($params[1])) {
            $date = $params[0];
            $days = $params[1];

            return gmdate('Y-m-d', strtotime($date . ' + ' . $days . ' days'));
        }

        return false;
    }

    public function addMonths($params)
    {
        if (!empty($params[0]) && !empty($params[1])) {
            $date = $params[0];
            $months = $params[1];

            return gmdate('Y-m-d', strtotime($date . ' + ' . $months . ' months'));
        }

        return false;
    }

    public function addYears($params)
    {
        if (!empty($params[0]) && !empty($params[1])) {
            $date = $params[0];
            $years = $params[1];

            return gmdate('Y-m-d', strtotime($date . ' + ' . $years . ' years'));
        }

        return false;
    }

    public function addMinutes($params)
    {
        if (!empty($params[0]) && !empty($params[1])) {
            $date = $params[0];
            $minutes = $params[1];

            return gmdate('Y-m-d H:i:s', strtotime($date . ' + ' . $minutes . ' minutes'));
        }

        return false;
    }
}
