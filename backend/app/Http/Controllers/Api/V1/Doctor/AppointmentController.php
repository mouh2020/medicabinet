<?php

namespace App\Http\Controllers\Api\V1\Doctor;

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

    // Update appointment status or time
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (! $appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $request->validate([
            'status' => 'in:scheduled,completed,cancelled',
            'time' => 'nullable|date|after:now'
        ]);

        $appointment->update($request->only('status', 'time'));

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
