<?php
namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorAuthController extends Controller
{
    public function login(Request $request)
    {
        $doctor = Doctor::where('email', $request->email)->first();

        if (! $doctor || $doctor->password !== $request->password) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $doctor->createToken('doctor-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'doctor' => $doctor
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'birthday' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'email' => 'required|email|unique:doctors,email',
            'password' => 'required|string|min:4',
        ]);

        $doctor = Doctor::create([
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'birthday' => $request->birthday,
            'address' => $request->address,
            'email' => $request->email,
            'password' => $request->password, // plaintext, since you're not using hashing
        ]);

        $token = $doctor->createToken('doctor-token')->plainTextToken;

        return response()->json([
            'message' => 'Doctor registered successfully',
            'token' => $token,
            'doctor' => $doctor,
        ], 201);
    }

}


