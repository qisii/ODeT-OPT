<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('user_id')->constraint('users')->onDelete('cascade');
            // $table->foreignIdFor(User::class, 'user_id');
            $table->string('title', 1000);
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constraint('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constraint('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Bind the trigger function to the table
        DB::unprepared('
        CREATE TRIGGER forms_trigger
            AFTER INSERT OR UPDATE OR DELETE ON forms
            FOR EACH ROW
            EXECUTE FUNCTION forms_trigger_function()
        ');
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('forms');
        
        // Drop the trigger
        DB::unprepared('DROP TRIGGER IF EXISTS forms_trigger ON forms');
    }
};
