<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Doctor::factory(3)->create();
        \App\Models\Assistant::factory(5)->create();
        \App\Models\Patient::factory(10)->create();
        \App\Models\Appointment::factory(20)->create();
        \App\Models\Consultation::factory(15)->create();
        \App\Models\Prescription::factory(15)->create();
    }
}
