<?php

use BitApps\Pi\Deps\BitApps\WPDatabase\Blueprint;
use BitApps\Pi\Deps\BitApps\WPDatabase\Schema;
use BitApps\Pi\Deps\BitApps\WPKit\Migration\Migration;
use BitApps\Pi\Model\FlowHistory;

if (! defined('ABSPATH')) {
    exit;
}

final class BITPIFlowHistoryTableMigration extends Migration
{
    public function up(): void
    {
        Schema::create(
            'flow_histories',
            function (Blueprint $table): void {
                $table->id();
                $table->bigint('flow_id', 20)->unsigned()->foreign('flows', 'id')->onDelete()->cascade();
                $table->enum('status', array_values(FlowHistory::STATUS))->defaultValue(FlowHistory::STATUS['PROCESSING']);
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::drop('flow_histories');
    }
}
