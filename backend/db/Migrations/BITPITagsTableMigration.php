<?php

use BitApps\Pi\Deps\BitApps\WPDatabase\Blueprint;
use BitApps\Pi\Deps\BitApps\WPDatabase\Schema;
use BitApps\Pi\Deps\BitApps\WPKit\Migration\Migration;

if (! defined('ABSPATH')) {
    exit;
}

final class BITPITagsTableMigration extends Migration
{
    public function up(): void
    {
        Schema::create(
            'tags',
            function (Blueprint $table): void {
                $table->id();
                $table->string('title');
                $table->string('slug');
                $table->string('filter')->nullable();
                $table->boolean('status')->defaultValue(0);
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::drop('tags');
    }
}
