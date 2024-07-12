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
        Schema::create('offices_history', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('office_id')->nullable();
            $table->string('name', 100)->nullable();
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
        Schema::dropIfExists('offices_history');
    }
};
