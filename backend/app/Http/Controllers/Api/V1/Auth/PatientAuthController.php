<?php
namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientAuthController extends Controller
{
    public function login(Request $request)
    {
        $patient = Patient::where('email', $request->email)->first();

        if (! $patient || $patient->password !== $request->password) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $patient->createToken('patient-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'patient' => $patient
        ]);
    }
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'phone' => 'required|string|max:20',
            'birthday' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'email' => 'required|email|unique:patients,email',
            'password' => 'required|string|min:4',
            'weight' => 'nullable|integer',
            'height' => 'nullable|numeric'
        ]);

        $patient = Patient::create([
            'full_name' => $request->full_name,
            'gender' => $request->gender,
            'phone' => $request->phone,
            'birthday' => $request->birthday,
            'address' => $request->address,
            'email' => $request->email,
            'password' => $request->password, // plaintext as per your choice
            'weight' => $request->weight,
            'height' => $request->height,
        ]);

        $token = $patient->createToken('patient-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'patient' => $patient
        ], 201);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

}
