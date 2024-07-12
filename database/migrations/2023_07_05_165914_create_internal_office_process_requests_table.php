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
        Schema::create('internal_office_process_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('created_by')->constraint('users')->onDelete('cascade');
            $table->string('sender_name');
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
            $table->string('office');
            $table->foreignId('updated_by')->nullable()->constraint('users')->onDelete('cascade');
            $table->foreignId('category_id')->constraint('categories')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved'])->default('pending');
            $table->timestamps();
        });

        // Bind the trigger function to the table
        DB::unprepared('
            CREATE TRIGGER internal_office_process_requests_trigger
            AFTER INSERT OR UPDATE OR DELETE ON internal_office_process_requests
            FOR EACH ROW
            EXECUTE FUNCTION internal_office_process_requests_trigger_function()
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('internal_office_process_requests');

        // Drop the trigger
        DB::unprepared('DROP TRIGGER IF EXISTS internal_office_process_requests_trigger ON internal_office_process_requests');
    }
};
