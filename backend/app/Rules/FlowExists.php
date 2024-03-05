<?php

namespace BitApps\Pi\Rules;

use BitApps\Pi\Model\Flow;
use BitApps\WPValidator\Rule;

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
