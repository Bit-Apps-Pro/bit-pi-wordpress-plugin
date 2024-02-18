<?php

use BitApps\Pi\Deps\BitApps\WPDatabase\Blueprint;
use BitApps\Pi\Deps\BitApps\WPDatabase\Schema;
use BitApps\Pi\Deps\BitApps\WPKit\Migration\Migration;

if (! defined('ABSPATH')) {
    exit;
}

final class BITPIWebhooksTableMigration extends Migration
{
    public function up(): void
    {
        Schema::create(
            'webhooks',
            function (Blueprint $table): void {
                $table->id();
                $table->string('title');
                $table->bigint('flow_id', 20)->nullable()->unique()->unsigned()->foreign('flows', 'id')->onDelete()->setNull();
                $table->string('app_slug');
                $table->string('webhook_slug');
                $table->longtext('ip_restrictions')->nullable();
                $table->longtext('details')->nullable();
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::drop('webhooks');
    }
}
