<?php

use BitApps\Pi\Deps\BitApps\WPDatabase\Blueprint;
use BitApps\Pi\Deps\BitApps\WPDatabase\Schema;
use BitApps\Pi\Deps\BitApps\WPKit\Migration\Migration;
use BitApps\Pi\Model\FlowLog;

if (! defined('ABSPATH')) {
    exit;
}

final class BITPIFlowLogsTableMigration extends Migration
{
    public function up(): void
    {
        Schema::create(
            'flow_logs',
            function (Blueprint $table): void {
                $table->id();
                $table->bigint('flow_history_id', 20)->unsigned()->foreign('flow_histories', 'id')->onDelete()->cascade();
                $table->string('node_id');
                $table->enum('status', array_values(FlowLog::STATUS));
                $table->mediumtext('messages')->nullable()->defaultValue(null);
                $table->longtext('input')->nullable()->defaultValue(null);
                $table->longtext('output')->nullable()->defaultValue(null);
                $table->mediumtext('details')->nullable()->defaultValue(null);
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::drop('flow_logs');
    }
}
