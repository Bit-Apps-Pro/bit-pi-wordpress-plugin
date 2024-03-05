<?php

namespace BitApps\Pi\Model;

use BitApps\WPDatabase\Model;

/**
 * Undocumented class.
 */
class FlowNode extends Model
{
    protected $casts = [
        'id'            => 'int',
        'flow_id'       => 'int',
        'count'         => 'int',
        'field_mapping' => 'object',
        'data'          => 'object',
        'variables'     => 'array',
    ];

    protected $fillable = [
        'node_id',
        'flow_id',
        'app_slug',
        'machine_slug',
        'machine_label',
        'field_mapping',
        'data',
        'variables',
    ];
}
