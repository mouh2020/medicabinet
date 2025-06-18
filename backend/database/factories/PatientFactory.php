<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'phone' => $this->faker->phoneNumber(),
            'birthday' => $this->faker->date(),
            'address' => $this->faker->address(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => '1234', // plaintext (for now)
            'weight' => $this->faker->numberBetween(50, 100),
            'height' => $this->faker->randomFloat(2, 1.5, 2.1),
        ];
    }
}
