<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    // View patient’s own appointments
    public function index()
    {
        $patient = Auth::user();
        $appointments = Appointment::where('patient_id', $patient->id)->get();

        return response()->json(['appointments' => $appointments]);
    }

    // Schedule new appointment
    public function store(Request $request)
    {
        $request->validate([
            'time' => 'required|date|after:now',
            'status' => 'in:scheduled,completed,cancelled',
        ]);

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'time' => $request->time,
            'status' => $request->status ?? 'scheduled',
            'created_date' => now()->toDateString(),
        ]);

        return response()->json(['message' => 'Appointment scheduled', 'appointment' => $appointment], 201);
    }

    // Reschedule
    public function update(Request $request, $id)
    {
        $appointment = Appointment::where('id', $id)->where('patient_id', Auth::id())->first();

        if (! $appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $request->validate([
            'time' => 'required|date|after:now'
        ]);

        $appointment->update([
            'time' => $request->time
        ]);

        return response()->json(['message' => 'Appointment rescheduled', 'appointment' => $appointment]);
    }

    // Cancel
    public function destroy($id)
    {
        $appointment = Appointment::where('id', $id)->where('patient_id', Auth::id())->first();

        if (! $appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment cancelled']);
    }
}
