<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement(['scheduled', 'completed', 'cancelled']),
            'time' => fake()->dateTimeBetween('+1 days', '+1 month'),
            'patient_id' => \App\Models\Patient::factory(),
            'created_date' => now()->toDateString(),
        ];
    }
}
