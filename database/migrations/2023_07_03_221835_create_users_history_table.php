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
        Schema::create('users_history', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('user_id');
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('middlename')->nullable();
            $table->string('suffix')->nullable();
            $table->string('contactnumber')->nullable();
            $table->string('address')->nullable();
            $table->tinyInteger('age')->nullable();
            $table->text('image')->nullable();
            $table->string('gender')->nullable();
            $table->tinyInteger('created_by')->nullable();
            $table->string('status');
            $table->tinyInteger('category_id')->nullable();
            $table->tinyInteger('category_request')->nullable();
            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
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
        Schema::dropIfExists('users_history');
    }
};
