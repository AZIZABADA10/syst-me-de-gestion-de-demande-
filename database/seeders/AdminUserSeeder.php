<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\RoleSeeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // Create the admin user
        User::firstOrCreate(
            ['email' => 'admin@example.com'], // Check if the user already exists
            [
                'name' => 'Admin',
                'password' => Hash::make('admin@123') // Set a default password
            ]
        );

        $this->command->info('Admin user created successfully!');
    }
}
