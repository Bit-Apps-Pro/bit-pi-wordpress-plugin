<?php

namespace BitApps\Pi\Model;

use BitApps\Pi\Deps\BitApps\WPDatabase\Model;

/**
 * Undocumented class.
 */
class FlowLog extends Model
{
    public const STATUS = [
        'SUCCESS' => 'success',
        'ERROR'   => 'error',
    ];

    protected $casts = [
        'id'              => 'int',
        'flow_history_id' => 'int',
        'output'          => 'array',
        'input'           => 'array',
        'details'         => 'array'
    ];

    protected $fillable = [
        'flow_history_id',
        'node_id',
        'status',
        'messages',
        'input',
        'output',
        'details'
    ];
}
