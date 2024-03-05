<?php

use BitApps\Pi\Model\FlowHistory;
use BitApps\WPDatabase\Blueprint;
use BitApps\WPDatabase\Schema;
use BitApps\WPKit\Migration\Migration;

if (! defined('ABSPATH')) {
    exit;
}

final class BitAppsPiFlowHistoryTableMigration extends Migration
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
