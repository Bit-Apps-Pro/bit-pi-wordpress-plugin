<?php

namespace BitApps\Pi\Model;

use BitApps\Pi\Config;
use BitApps\WPDatabase\Model;

/**
 * Undocumented class.
 */
class Webhook extends Model
{
    protected $prefix = Config::VAR_PREFIX;

    protected $casts = [
        'id' => 'int'
    ];

    protected $fillable = [
        'title',
        'flow_id',
        'app_slug',
        'webhook_slug'
    ];

    public function flow()
    {
        return $this->hasOne(Flow::class, 'id', 'flow_id');
    }
}
