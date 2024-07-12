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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname')->nullable();
            $table->string('middlename')->nullable();
            $table->string('suffix')->nullable();
            $table->string('contactnumber')->nullable();
            $table->string('address')->nullable();
            $table->tinyInteger('age')->nullable();
            $table->text('image')->nullable();
            $table->enum('gender', ['Female', 'Male'])->nullable();
            $table->tinyInteger('created_by')->nullable();
            $table->enum('status', ['Active', 'Disabled'])->default('Active');
            $table->tinyInteger('category_id')->nullable();
            $table->tinyInteger('category_request')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->foreignId('updated_by')->nullable()->constraint('users')->onDelete('cascade');
            $table->rememberToken();
            $table->timestamps();
        });

        // Bind the trigger function to the table
        DB::unprepared('
            CREATE TRIGGER users_trigger
            AFTER INSERT OR UPDATE OR DELETE ON users
            FOR EACH ROW
            EXECUTE FUNCTION users_trigger_function()
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');

        // Drop the trigger
        DB::unprepared('DROP TRIGGER IF EXISTS users_trigger ON users');
    }
};
