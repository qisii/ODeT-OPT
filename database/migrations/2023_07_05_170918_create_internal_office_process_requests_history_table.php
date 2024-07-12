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
        Schema::create('internal_office_process_requests_history', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('request_id')->nullable();
            $table->string('name')->nullable();
            $table->string('sender_name')->nullable();
            $table->string('date_received_ovcia')->nullable();
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->string('dts_num')->nullable();
            $table->string('pd_num')->nullable();
            $table->string('suc_num')->nullable();
            $table->string('date_submitted_ched')->nullable();
            $table->string('date_responded_ched')->nullable();
            $table->string('date_approval_ched')->nullable();
            $table->text('by_means')->nullable();
            $table->string('re_entry_plan_future_actions')->nullable();
            $table->string('remarks')->nullable();
            $table->string('office')->nullable();
            $table->tinyInteger('created_by')->nullable();
            $table->tinyInteger('updated_by')->nullable();
            $table->tinyInteger('category_id')->nullable();
            $table->enum('status', ['pending', 'approved'])->default('pending');
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
        Schema::dropIfExists('internal_office_process_requests_history');
    }
};
