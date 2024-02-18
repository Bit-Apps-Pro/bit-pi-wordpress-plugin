<?php

namespace BitApps\Pi\Model;

use BitApps\Pi\Deps\BitApps\WPDatabase\Model;

/**
 * Undocumented class
 */
class Tag extends Model
{
    protected $casts = [
        'id'     => 'int',
        'status' => 'boolean'
    ];

    protected $fillable = [
        'title',
        'slug',
        'filter',
        'status',
    ];
}
