<?php

namespace BitApps\Pi\Services\Functions;

trait Str
{
    public function strLength($string)
    {
        $string = $this->isArrayCheck($string);

        return mb_strlen($string);
    }

    public function lowercase($string)
    {
        $string = $this->isArrayCheck($string);

        return mb_strtolower($string);
    }

    public function uppercase($string, $encoding = null)
    {
        $string = $this->isArrayCheck($string);

        return mb_strtoupper($string);
    }

    public function capitalize($string)
    {
        $string = $this->isArrayCheck($string);

        return mb_convert_case($string, MB_CASE_TITLE, 'UTF-8');
    }

    public function trim($string)
    {
        $string = $this->isArrayCheck($string);

        return trim($string);
    }

    public function concat($params)
    {
        return implode('', $params);
    }

    public function camelCase($string)
    {
        $string = $this->isArrayCheck($string);

        return lcfirst($string);
    }

    public function startCase($string)
    {
        $string = $this->isArrayCheck($string);

        return ucfirst($string);
    }

    public function replace($params)
    {
        if (!is_countable($params) && \count($params) !== 3) {
            return false;
        }
        $string = $params[2];
        $search = $params[0];
        $replacement = $params[1];

        return str_replace($search, $replacement, $string);
    }

    public function strContains($params)
    {
        if (!empty($params[0]) && !empty($params[1])) {
            return false;
        }

        return mb_strpos($params[0], $params[1]) !== false;
    }

    public function stripHtml($string)
    {
        $string = $this->isArrayCheck($string);

        return wp_strip_all_tags($string);
    }

    public function escapeHtml($string)
    {
        $string = $this->isArrayCheck($string);

        return htmlspecialchars($string);
    }

    public function md5($string)
    {
        $string = $this->isArrayCheck($string);

        return md5($string);
    }

    private function isArrayCheck($string)
    {
        if (empty($string)) {
            return false;
        }
        if (\is_array($string)) {
            $string = implode('', $string);
        }

        return $string;
    }
}
