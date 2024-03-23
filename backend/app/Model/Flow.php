<?php

namespace BitApps\Pi\Model;

use BitApps\Pi\Config;
use BitApps\WPDatabase\Model;

/**
 * Undocumented class.
 */
class Flow extends Model
{
    public const isHookCaptured = 1;

    public const listenerType = [
        'NONE'     => 0,
        'CAPTURE'  => 1, // Capture only trigger data
        'RUN_ONCE' => 2  // Flow run once
    ];

    public const status = [
        'ACTIVE'    => 1,
        'IN_ACTIVE' => 0
    ];

    public const triggerType = [
        'WP_HOOK'  => 1,
        'WEBHOOK'  => 2,
        'SCHEDULE' => 3
    ];

    public const TOOLS = 'tools';

    protected $prefix = Config::VAR_PREFIX;

    protected $casts = [
        'id'              => 'int',
        'run_count'       => 'int',
        'is_hook_capture' => 'int',
        'listener_type'   => 'int',
        'is_active'       => 'int',
        'map'             => 'object',
        'data'            => 'object',

    ];

    protected $fillable = [
        'title',
        'run_count',
        'is_active',
        'map',
        'data',
        'tag',
        'tag_id',
        'trigger_type',
        'listener_type',
        'is_hook_capture'
    ];

    public function logs()
    {
        return $this->hasOne(FlowLog::class, 'flow_id');
    }

    public function nodes()
    {
        return $this->hasMany(FlowNode::class, 'flow_id', 'id');
    }

    public function nodesCount()
    {
        return $this
            ->hasMany(FlowNode::class, 'flow_id', 'id')
            ->where('app_slug', '!=', static::TOOLS)
            ->groupBy('flow_id')
            ->select('flow_id')
            ->withCount();
    }
}
