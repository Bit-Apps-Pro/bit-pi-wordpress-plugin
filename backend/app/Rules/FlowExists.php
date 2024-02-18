<?php

namespace BitApps\Pi\Rules;

use BitApps\Pi\Deps\BitApps\WPValidator\Rule;
use BitApps\Pi\Model\Flow;

final class FlowExists extends Rule
{
    private $message = ':attribute does not exists in flow';

    public function validate($value)
    {
        $flow = new Flow($value);

        return $flow->exists();
    }

    public function message()
    {
        return $this->message;
    }
}
