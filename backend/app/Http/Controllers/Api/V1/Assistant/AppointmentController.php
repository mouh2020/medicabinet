<?php

namespace App\Http\Controllers\Api\V1\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    
    // View all appointments
    public function index()
    {
        $appointments = Appointment::with('patient')->latest()->get();
        return response()->json(['appointments' => $appointments]);
    }

    // Create appointment for a patient
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'time' => 'required|date|after:now',
            'status' => 'in:scheduled,completed,cancelled'
        ]);

        $appointment = Appointment::create([
            'patient_id' => $request->patient_id,
            'time' => $request->time,
            'status' => $request->status ?? 'scheduled',
            'created_date' => now()->toDateString()
        ]);

        return response()->json(['message' => 'Appointment created', 'appointment' => $appointment], 201);
    }

    // Update appointment
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (! $appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $request->validate([
            'time' => 'nullable|date|after:now',
            'status' => 'nullable|in:scheduled,completed,cancelled',
        ]);

        $appointment->update($request->only('time', 'status'));

        return response()->json(['message' => 'Appointment updated', 'appointment' => $appointment]);
    }

    // Delete appointment
    public function destroy($id)
    {
        $appointment = Appointment::find($id);

        if (! $appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted']);
    }
}
