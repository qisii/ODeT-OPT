<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Form;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('form_files', function (Blueprint $table) {
            $table->id();
            $table->text('file')->nullable();
            $table->text('file_title');
            $table->text('file_description');
            $table->foreignIdFor(Form::class, 'form_id');
            $table->foreignId('added_by')->constraint('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constraint('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Bind the trigger function to the table
        DB::unprepared('
            CREATE TRIGGER form_files_trigger
            AFTER INSERT OR UPDATE OR DELETE ON form_files
            FOR EACH ROW
            EXECUTE FUNCTION form_files_trigger_function()
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('form_files');

        // Drop the trigger
        DB::unprepared('DROP TRIGGER IF EXISTS form_files_trigger ON form_files');
    }
};
