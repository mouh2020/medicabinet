<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;

class PatientController extends Controller
{
    // View all patients
    public function index()
    {
        $patients = Patient::latest()->get();
        return response()->json(['patients' => $patients]);
    }

    // View single patient
    public function show($id)
    {
        $patient = Patient::find($id);

        if (! $patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

        return response()->json(['patient' => $patient]);
    }

    // Add patient
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'phone' => 'required|string',
            'birthday' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'email' => 'required|email|unique:patients,email',
            'password' => 'required|string|min:4',
            'weight' => 'nullable|integer',
            'height' => 'nullable|numeric'
        ]);

        $patient = Patient::create($request->only([
            'full_name', 'gender', 'phone', 'birthday', 'address',
            'email', 'password', 'weight', 'height'
        ]));

        return response()->json(['message' => 'Patient created', 'patient' => $patient], 201);
    }

    // Update patient
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (! $patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

        $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female,other',
            'phone' => 'sometimes|string',
            'birthday' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'email' => 'sometimes|email|unique:patients,email,' . $id,
            'password' => 'sometimes|string|min:4',
            'weight' => 'nullable|integer',
            'height' => 'nullable|numeric'
        ]);

        $patient->update($request->only([
            'full_name', 'gender', 'phone', 'birthday', 'address',
            'email', 'password', 'weight', 'height'
        ]));

        return response()->json(['message' => 'Patient updated', 'patient' => $patient]);
    }

    // Delete patient
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (! $patient) {
            return response()->json(['error' => 'Patient not found'], 404);
        }

        $patient->delete();

        return response()->json(['message' => 'Patient deleted']);
    }
}
