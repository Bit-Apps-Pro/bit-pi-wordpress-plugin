<?php

use BitApps\WPDatabase\Blueprint;
use BitApps\WPDatabase\Schema;
use BitApps\WPKit\Migration\Migration;

if (! defined('ABSPATH')) {
    exit;
}

final class BitAppsPiAppConnectionsTableMigration extends Migration
{
    public function up(): void
    {
        Schema::create(
            'connections',
            function (Blueprint $table): void {
                $table->id();
                $table->string('app_slug');
                $table->string('auth_type');
                $table->string('connection_name');
                $table->string('account_name')->nullable();
                $table->string('encrypt_keys')->nullable();
                $table->longtext('auth_details');
                $table->tinyint('status')->defaultValue(1);
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::drop('connections');
    }
}
