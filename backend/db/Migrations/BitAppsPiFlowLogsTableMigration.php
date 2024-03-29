<?php

use BitApps\Pi\Config;
use BitApps\Pi\Model\FlowLog;
use BitApps\WPDatabase\Blueprint;
use BitApps\WPDatabase\Connection;
use BitApps\WPDatabase\Schema;
use BitApps\WPKit\Migration\Migration;

if (! defined('ABSPATH')) {
    exit;
}

final class BitAppsPiFlowLogsTableMigration extends Migration
{
    public function up(): void
    {
        Schema::withPrefix(Connection::wpPrefix() . Config::VAR_PREFIX)->create(
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
        Schema::withPrefix(Connection::wpPrefix() . Config::VAR_PREFIX)->drop('flow_logs');
    }
}
