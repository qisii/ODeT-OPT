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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('updated_by')->nullable()->constraint('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Bind the trigger function to the table
        DB::unprepared('
            CREATE TRIGGER categories_trigger
            AFTER INSERT OR UPDATE OR DELETE ON categories
            FOR EACH ROW
            EXECUTE FUNCTION categories_trigger_function()
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');

        // Drop the trigger
        DB::unprepared('DROP TRIGGER IF EXISTS categories_trigger ON categories');
    }
};
