<?php

namespace BitApps\Pi\Model;

use BitApps\Pi\Deps\BitApps\WPDatabase\Model;

/**
 * Undocumented class.
 */
class Connection extends Model
{
    public const STATUS = [
        'verified' => 1,
        'pending'  => 2,
        'failed'   => 3
    ];

    protected $casts = [
        'id'           => 'int',
        'auth_details' => 'object',
        'status'       => 'int',
    ];

    protected $fillable = [
        'app_slug',
        'auth_type',
        'connection_name',
        'account_name',
        'encrypt_keys',
        'auth_details',
        'status',
    ];
}
