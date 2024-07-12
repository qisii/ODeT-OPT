<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faculty_admin_staff_requests_files_history', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('file_id')->nullable();
            $table->text('file')->nullable();
            $table->text('file_title')->nullable();
            $table->text('file_description')->nullable();
            $table->tinyInteger('added_by')->nullable();
            $table->tinyInteger('updated_by')->nullable();
            $table->tinyInteger('document_id')->nullable();
            $table->timestamps();
            $table->enum('operation', ['INSERT', 'UPDATE', 'DELETE']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faculty_admin_staff_requests_files_history');
    }
};
