<?php

use BitApps\Pi\Deps\BitApps\WPDatabase\Blueprint;
use BitApps\Pi\Deps\BitApps\WPDatabase\Schema;
use BitApps\Pi\Deps\BitApps\WPKit\Migration\Migration;

if (!defined('ABSPATH')) {
    exit;
}

final class BITPIFlowsTableMigration extends Migration
{
    public function up(): void
    {
        Schema::create(
            'flows',
            function (Blueprint $table): void {
                $table->id();
                $table->string('title');
                $table->int('run_count');
                $table->boolean('is_active')->defaultValue(1);
                $table->longtext('map');
                $table->longtext('data');
                $table->string('tag_id')->nullable();
                $table->tinyint('trigger_type');
                $table->tinyint('listener_type')->defaultValue(0);
                $table->tinyint('is_hook_capture')->defaultValue(0);
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::drop('flows');
    }
}
