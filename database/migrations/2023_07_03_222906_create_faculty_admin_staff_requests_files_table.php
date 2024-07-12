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
        Schema::create('faculty_admin_staff_requests_files', function (Blueprint $table) {
            $table->id();
            $table->text('file')->nullable();
            $table->text('file_title');
            $table->text('file_description');
            $table->foreignId('added_by')->constraint('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constraint('users')->onDelete('cascade');
            $table->foreignId('document_id')->constraint('faculty_admin_staff_requests')->onDelete('cascade');
            $table->timestamps();
        });

        // Bind the trigger function to the table
        DB::unprepared('
            CREATE TRIGGER faculty_admin_staff_requests_files_trigger
            AFTER INSERT OR UPDATE OR DELETE ON faculty_admin_staff_requests_files
            FOR EACH ROW
            EXECUTE FUNCTION faculty_admin_staff_requests_files_trigger_function()
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faculty_admin_staff_requests_files');

        // Drop the trigger
        DB::unprepared('DROP TRIGGER IF EXISTS faculty_admin_staff_requests_files_trigger ON faculty_admin_staff_requests_files');
    }
};
