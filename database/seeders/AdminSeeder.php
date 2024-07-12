<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = [
            'firstname' => 'Administrator',
            'lastname' => 'Lastname',
            'contactnumber' => '123456789',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('Admin123.'),
            'role' => 'admin', // Add the role here
        ];
    
        $user = User::create([
            'firstname' => $admin['firstname'],
            'lastname' => $admin['lastname'],
            'contactnumber' => $admin['contactnumber'],
            'email' => $admin['email'],
            'email_verified_at' => $admin['email_verified_at'],
            'password' => $admin['password'],
        ]);
    
        $role = Role::where('name', $admin['role'])->first();
        $user->assignRole($role);
    }
}
