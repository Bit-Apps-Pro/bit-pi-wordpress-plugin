<?php

use BitApps\Pi\Config;
use BitApps\WPDatabase\Blueprint;
use BitApps\WPDatabase\Connection;
use BitApps\WPDatabase\Schema;
use BitApps\WPKit\Migration\Migration;

if (! defined('ABSPATH')) {
    exit;
}

final class BitAppsPiFlowNodesTableMigration extends Migration
{
    public function up(): void
    {
        Schema::withPrefix(Connection::wpPrefix() . Config::VAR_PREFIX)->create(
            'flow_nodes',
            function (Blueprint $table): void {
                $table->id();
                $table->bigint('flow_id', 20)->unsigned()->foreign('flows', 'id')->onDelete()->cascade();
                $table->string('node_id');
                $table->string('app_slug')->nullable();
                $table->string('machine_slug')->nullable();
                $table->string('machine_label')->nullable();
                $table->longtext('field_mapping')->nullable();
                $table->longtext('data')->nullable();
                $table->mediumtext('variables');
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::withPrefix(Connection::wpPrefix() . Config::VAR_PREFIX)->drop('flow_nodes');
    }
}
