<?php

namespace BitApps\Pi\Model;

use BitApps\WPDatabase\Model;

/**
 * Undocumented class.
 */
class FlowHistory extends Model
{
    public const STATUS = [
        'SUCCESS'         => 'success',
        'PROCESSING'      => 'processing',
        'FAILED'          => 'failed',
        'PARTIAL_SUCCESS' => 'partial-success'
    ];

    protected $table = 'flow_histories';

    protected $casts = [
        'id'      => 'int',
        'flow_id' => 'int',
    ];

    protected $fillable = [
        'flow_id',
        'status'
    ];

    public function logs()
    {
        return $this->hasMany(FlowLog::class, 'flow_history_id', 'id');
    }
}
