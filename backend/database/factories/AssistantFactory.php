<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Assistant>
 */
class AssistantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {  
        return [
            'full_name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'birthday' => fake()->date(),
            'address' => fake()->address(),
            'email' => fake()->unique()->safeEmail(),
            'password' => '1234', // plaintext
        ];
    }
}
