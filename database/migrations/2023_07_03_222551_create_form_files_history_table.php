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
        Schema::create('form_files_history', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('form_file_id')->nullable();
            $table->text('file')->nullable();
            $table->text('file_title')->nullable();
            $table->text('file_description')->nullable();
            $table->tinyInteger('added_by')->nullable();
            $table->tinyInteger('updated_by')->nullable();
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
        Schema::dropIfExists('form_files_history');
    }
};
