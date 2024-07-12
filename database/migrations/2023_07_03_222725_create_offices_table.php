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
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('updated_by')->nullable()->constraint('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Bind the trigger function to the table
        DB::unprepared('
            CREATE TRIGGER offices_trigger
            AFTER INSERT OR UPDATE OR DELETE ON offices
            FOR EACH ROW
            EXECUTE FUNCTION offices_trigger_function()
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offices');

        // Drop the trigger
        DB::unprepared('DROP TRIGGER IF EXISTS offices_trigger ON offices');
    }
};
